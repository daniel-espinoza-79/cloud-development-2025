import type { MessagePayload, NotificationPayload } from "firebase/messaging";

import { toast } from "sonner";

const notificationHandler = async (payload: MessagePayload) => {
    
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return;
  }
  console.log("Notification received:", payload);
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  if (Notification.permission === "granted") {
    console.log("Notification permission granted");
    if (payload.data?.type === "like") {
      handleNewLike(payload.notification);
    }
  } else {
    console.warn("Notification permission denied");
  }
};

const handleNewLike = async (data: NotificationPayload | null | undefined) => {
  if (data) {
    toast.success(data.title, {
      description: data.body,
    });
  }
};

export default notificationHandler;
