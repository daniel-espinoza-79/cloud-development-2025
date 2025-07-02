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
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const { moderatePost } = require("./functs/moderations/postModerator");
const {sendBulkNotification} = require("./functs/notifications/sendBulkNotifications");
const { toggleLike } = require("./functs/likes/toogle-likes");
const { getPosts } = require("./functs/posts/getPosts");
const { POSTS_COLLECTION } = require("./config");

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

exports.sendBulkNotification = onCall(sendBulkNotification);

exports.moderateNewPost = onDocumentCreated(
  { document: `${POSTS_COLLECTION}/{postId}` },
  moderatePost
);

exports.toggleLike = onCall(toggleLike);

exports.getPosts = onCall(getPosts);