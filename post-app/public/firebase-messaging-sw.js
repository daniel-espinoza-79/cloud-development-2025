// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
});

const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle =
    payload.notification?.title || payload.data.title || "New Message";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      payload.data.body ||
      "You have a new message",
    icon: "/vite.svg",
    badge: "/vite.svg",
    tag: payload.data.tag || "default-tag",
    data: payload.data,
    actions: [
      { action: "open", title: "Open" },
      { action: "close", title: "Close" },
    ],
    data: {
      url: payload.data.url || "/",
      postId: payload.data.postId,
      ...payload.data,
    },
  };

  console.log("Service Worker: Showing notification:", notificationTitle);
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
