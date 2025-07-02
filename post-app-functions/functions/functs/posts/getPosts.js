const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { POSTS_COLLECTION , USER_LIKES} = require("../../config");

async function getPosts(request) {
  try {
    const currentUserId = request.auth?.uid;
    const db = admin.firestore();

    const postsSnapshot = await db
      .collection(POSTS_COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      liked: false,
    }));

    if (currentUserId) {
      const userLikesDoc = await db
        .collection(USER_LIKES)
        .doc(currentUserId)
        .get();

      if (userLikesDoc.exists) {
        const userLikes = userLikesDoc.data().likedPosts || {};

        posts.forEach((post) => {
          post.liked = userLikes[post.id] === true;
        });
      }
    }

    logger.info(
      `Retrieved ${posts.length} posts for user ${currentUserId || "anonymous"}`
    );

    return { posts };
  } catch (error) {
    logger.error("Error getting posts:", error);
    throw new Error(error.message);
  }
}

module.exports = { getPosts };
