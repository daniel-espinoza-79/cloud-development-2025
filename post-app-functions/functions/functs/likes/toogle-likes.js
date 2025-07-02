const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { POSTS_COLLECTION } = require("../../config");
const {
  sendLikeNotification,
} = require("../notifications/sendLikeNotifications");

async function toggleLike(request) {
  try {
    const { postId } = request.data;
    const userId = request.auth?.uid;
    const userName =  request.auth.token.email.split("@")[0] ||
       request.auth.token.name ||
      "User";

    if (!userId) {
      throw new Error("Authentication required");
    }

    if (!postId) {
      throw new Error("postId is required");
    }

    const db = admin.firestore();

    const postRef = db.collection(POSTS_COLLECTION).doc(postId);
    const userLikesRef = db.collection("user_likes").doc(userId);

    const result = await db.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);
      const userLikesDoc = await transaction.get(userLikesRef);

      if (!postDoc.exists) {
        throw new Error("Post not found");
      }

      const postData = postDoc.data();
      const userLikes = userLikesDoc.exists
        ? userLikesDoc.data()
        : { likedPosts: {} };

      const hasLiked = userLikes.likedPosts?.[postId] === true;
      const currentLikesCount = postData.likesCount || 0;

      if (hasLiked) {
        transaction.update(postRef, {
          likesCount: Math.max(0, currentLikesCount - 1),
        });

        transaction.set(
          userLikesRef,
          {
            likedPosts: {
              ...userLikes.likedPosts,
              [postId]: admin.firestore.FieldValue.delete(),
            },
          },
          { merge: true }
        );

        return { liked: false, likesCount: Math.max(0, currentLikesCount - 1) };
      } else {
        transaction.update(postRef, {
          likesCount: currentLikesCount + 1,
        });

        transaction.set(
          userLikesRef,
          {
            likedPosts: {
              ...userLikes.likedPosts,
              [postId]: true,
            },
          },
          { merge: true }
        );

        if (postData.userId !== userId) {
          await sendLikeNotification(postData.userId, userId, userName, postId);
        }
        return { liked: true, likesCount: currentLikesCount + 1 };
      }
    });

    logger.info(`Like toggled for post ${postId} by user ${userId}`, result);
    return result;
  } catch (error) {
    logger.error("Error toggling like:", error);
    throw new Error(error.message);
  }
}

module.exports = {
  toggleLike,
};
