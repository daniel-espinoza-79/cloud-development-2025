const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { moderateText } = require("./textModerator");
const {
  POSTS_COLLECTION,
  MODERATION_LOGS_COLLECTION,
} = require("../../config");

/**
 * Moderates a post based on its content.
 * This function checks specific fields in the post data for inappropriate content
 * @param {CloudEvent} event
 */
async function moderatePost(event) {
  try {
    const postData = event.data?.data();
    const postId = event.params.postId;

    if (!postData) {
      logger.warn(`No data found for post: ${postId}`);
      return;
    }

    logger.info(`Starting moderation for post: ${postId}`);

    const fieldsToModerate = ["content", "title"];
    const updateData = {};
    const moderatedFields = [];
    let needsUpdate = false;

    fieldsToModerate.forEach((field) => {
      if (postData[field]) {
        const result = moderateText(postData[field]);

        if (result.moderated) {
          updateData[field] = result.text;
          updateData[`${field}_moderated`] = true;
          moderatedFields.push(field);
          needsUpdate = true;

          logger.info(`Field '${field}' moderated in post ${postId}`);
        }
      }
    });

    if (needsUpdate) {
      updateData.is_moderated = true;
      updateData.moderated_at = admin.firestore.FieldValue.serverTimestamp();
      updateData.moderation_count = moderatedFields.length;

      const postRef = admin
        .firestore()
        .collection(POSTS_COLLECTION)
        .doc(postId);
      await postRef.update(updateData);

      logger.info(
        `Post ${postId} successfully moderated. Fields: ${moderatedFields.join(
          ", "
        )}`
      );

      await createModerationLog(postId, postData, moderatedFields, updateData);

      await notifyUserAboutModeration(
        postData.user_id,
        postId,
        moderatedFields
      );
    } else {
      logger.info(`Post ${postId} passed moderation check`);
    }
  } catch (error) {
    logger.error(`Error moderating post ${event.params.postId}:`, error);

    try {
      const postRef = admin
        .firestore()
        .collection(POSTS_COLLECTION)
        .doc(event.params.postId);
      await postRef.update({
        moderation_error: true,
        moderation_error_message: error.message,
        moderation_error_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (updateError) {
      logger.error("Failed to update post with error status:", updateError);
    }

    throw error;
  }
}

/**
 * Creates a moderation log entry for the post.
 * This log includes the original content, moderated fields, and the updated content.
 */
async function createModerationLog(
  postId,
  originalData,
  moderatedFields,
  updateData
) {
  try {
    await admin
      .firestore()
      .collection(MODERATION_LOGS_COLLECTION)
      .add({
        post_id: postId,
        moderated_fields: moderatedFields,
        field_count: moderatedFields.length,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        original_content: moderatedFields.reduce((acc, field) => {
          acc[field] = originalData[field];
          return acc;
        }, {}),
        moderated_content: moderatedFields.reduce((acc, field) => {
          acc[field] = updateData[field];
          return acc;
        }, {}),
        user_id: originalData.user_id || null,
      });

    logger.info(`Moderation log created for post: ${postId}`);
  } catch (error) {
    logger.error("Failed to create moderation log:", error);
  }
}

async function notifyUserAboutModeration(userId, postId, moderatedFields) {
  if (!userId) return;

  try {
    await admin
      .firestore()
      .collection("user_notifications")
      .add({
        user_id: userId,
        type: "post_moderated",
        title: "Contenido Moderado",
        message: `Tu publicación ha sido moderada automáticamente. Campos afectados: ${moderatedFields.join(
          ", "
        )}`,
        post_id: postId,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        read: false,
      });

    logger.info(`Moderation notification sent to user: ${userId}`);
  } catch (error) {
    logger.error("Failed to send moderation notification:", error);
  }
}

module.exports = {
  moderatePost,
  createModerationLog,
  notifyUserAboutModeration,
};
