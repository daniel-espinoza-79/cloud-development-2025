const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { TOKENS_COLLECTION } = require("../../config");

async function sendBulkNotification(request) {
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
}

module.exports = {
  sendBulkNotification,
};
