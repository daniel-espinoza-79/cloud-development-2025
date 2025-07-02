/* eslint-disable @typescript-eslint/no-explicit-any */
import { messaging, functions } from "@/config/firebase.config";
import { fcmTokenService } from "@/services/fcmTokenService";
import { httpsCallable } from "firebase/functions";
import { getToken, onMessage, type MessagePayload } from "firebase/messaging";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { usePostsTrigger } from "@/contexts/RefeshPostContext";
import notificationHandler from "@/services/NotificationHandler";

export interface useFirebaseNotificationsReturn {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
  sendNotification: (
    token: string,
    title: string,
    message: string,
    data?: any
  ) => Promise<void>;
  sendBulkNotification: (
    tokens: string[],
    title: string,
    message: string,
    data?: any
  ) => Promise<void>;
}

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

const useFirebaseNotifications = () => {
  const {
    authState: { user },
  } = useAuth();
  const [askPermission, setAskPermission] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setThereAreNewPosts } = usePostsTrigger();

  const requestPermission = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!VAPID_KEY) {
        throw new Error(
          "VAPID key not found. Add VITE_FIREBASE_VAPID_KEY to your .env file"
        );
      }
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("Push notifications not supported in this browser");
      }
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error(
          `Permission ${permission}. Please allow notifications in your browser.`
        );
      }

      const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });

      if (fcmToken && user) {
        setToken(fcmToken);
        fcmTokenService.addToken(user.id, user.email, fcmToken);
        localStorage.setItem("fcm_token", fcmToken);
      } else {
        throw new Error(
          "Failed to get FCM token. Check your Firebase configuration and VAPID key."
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("FCM Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendBulkNotifications = async (
    title: string,
    message: string,
    data: any = {}
  ) => {
    try {
      if (!user) {
        alert("User not authenticated. Cannot send notifications.");
        throw new Error("User not authenticated. Cannot send notifications.");
      }
      const sendNotificationFn = httpsCallable(
        functions,
        "sendBulkNotification"
      );
      const result = await sendNotificationFn({
        title,
        message,
        data,
        senderId: user.id,
      });

      return result.data;
    } catch (err) {
      console.error("Error sending notification:", err);
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onMessage(
      messaging,
      async (payload: MessagePayload) => {
        console.log ("Notification received:", payload);
        if (payload.data?.type === "bulk") {
          setThereAreNewPosts?.(true);
        }
        await notificationHandler(payload);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("fcm_token");
    if (savedToken) {
      setToken(savedToken);
    } else {
      setAskPermission(true);
    }
  }, []);

  return {
    token,
    isLoading,
    error,
    requestPermission,
    sendBulkNotifications,
    askPermission,
    setAskPermission,
  };
};

export default useFirebaseNotifications;
