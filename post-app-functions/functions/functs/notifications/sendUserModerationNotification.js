async function sendUserPostModerationNotification(userId) {
  try {
    const db = admin.firestore();
    const userRef = db.collection(USERS_COLLECTION).doc(userId);
    const userData = await userRef.get();
  } catch (error) {
    logger.error("Failed to send moderation notification:", error);
  }
}

module.exports = { sendUserPostModerationNotification };
