const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { TOKENS_COLLECTION } = require("../../config");

async function sendLikeNotification(postOwnerId, likerId, username,postId) {
  try {
    const db = admin.firestore();
    var fcmToken = null;
    const docSnap = await db
      .collection(TOKENS_COLLECTION)
      .doc(postOwnerId)
      .get();

    logger.info(`FCM token for user ${postOwnerId}:`, docSnap.data()?.token);
    if (docSnap.exists) {
      fcmToken = docSnap.data()?.token;
    }

    const likerName = username ?? "Someone";

    if (!fcmToken) {
      logger.warn(`No FCM token available for user ${postOwnerId}`);
      return;
    }

    const message = {
      token: fcmToken,
      notification: {
        title: "New Like! ❤️",
        body: `${likerName} liked your post`,
      },
      data: {
        type: "like",
        postId: postId,
        likerId: likerId,
        title: "New Like! ❤️",
        body: `${likerName} liked your post`,
        timestamp: Date.now().toString(),
      }
    };
    logger.info(`Push notification data:`, message);

    const response = await admin.messaging().send(message);
    logger.info(`Push notification sent successfully:`, response);

    logger.info("Like notification sent successfully");
  } catch (error) {
    logger.error("Error sending like notification:", error);
    throw error;
  }
}

module.exports = { sendLikeNotification };
