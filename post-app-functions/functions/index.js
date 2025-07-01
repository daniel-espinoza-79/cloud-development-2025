/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions");
const { onCall } = require("firebase-functions/v2/https");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();
// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });



const TOKENS_COLLECTION = "user_fcm_tokens";

exports.sendBulkNotification = onCall(async (request) => {
  try {
    const { title, message, senderId, data = {} } = request.data;

    if (!title || !message) {
      throw new Error("Title and message are required");
    }

    logger.info("Bulk notification started", { title, senderId });

    const db = admin.firestore();
    const snapshot = await db.collection(TOKENS_COLLECTION).get();

    if (snapshot.empty) {
      throw new Error("No users found");
    }

    const tokens = [];
    let excludedSender = null;

    snapshot.forEach((doc) => {
      const userId = doc.id;
      const userData = doc.data();

      if (senderId && userId === senderId) {
        excludedSender = userData.email || userId;
        logger.info("Excluded sender", { userId, email: excludedSender });
      } else if (userData.token) {
        tokens.push(userData.token);
      }
    });

    if (tokens.length === 0) {
      throw new Error("No valid recipients found");
    }

    const payload = {
      notification: { title, body: message },
      data: {
        ...data,
        timestamp: Date.now().toString(),
        type: "bulk",
      },
      tokens,
    };

    const result = await admin.messaging().sendEachForMulticast(payload);

    logger.info("Bulk notification completed", {
      success: result.successCount,
      failed: result.failureCount,
      total: tokens.length,
    });

    return {
      success: true,
      sent: result.successCount,
      failed: result.failureCount,
      total: tokens.length,
      excluded: excludedSender,
    };
  } catch (error) {
    logger.error("Bulk notification failed", error);
    throw new Error(error.message);
  }
});

