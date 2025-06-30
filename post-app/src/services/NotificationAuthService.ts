/* eslint-disable @typescript-eslint/no-explicit-any */
import app from "@/config/firebase.config";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;

export const getFCMToken = async (): Promise<string | null> => {
  if (!messaging) return null;

  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log("FCM token obtained:", token);
      return token;
    } else {
      console.log("Could not obtain FCM token");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export const setupForegroundMessageListener = (
  callback: (payload: any) => void
) => {
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);
    callback(payload);
  });
};
