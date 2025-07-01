/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

export interface FCMToken {
  id?: string;
  userId: string;
  token: string;
  createdAt: any;
  isActive: boolean;
}

export interface NotificationData {
  id?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  userId?: string;
  createdAt: any;
  type: "NEW_POST" | "LIKE" | "COMMENT" | "FOLLOW";
}

const NOTIFICATIONS_COLLECTION_NAME = "notifications";
const FCM_TOKENS_COLLECTION_NAME = "fcm-tokens";
class NotificationService {
  // Save user's FCM token
  async saveUserFCMToken(userId: string, token: string): Promise<void> {
    try {
      // Check if token already exists for this user
      const tokensRef = collection(db, FCM_TOKENS_COLLECTION_NAME);
      const q = query(
        tokensRef,
        where("userId", "==", userId),
        where("token", "==", token)
      );
      const existingTokens = await getDocs(q);

      if (existingTokens.empty) {
        // Create new token
        await addDoc(tokensRef, {
          userId,
          token,
          createdAt: serverTimestamp(),
          isActive: true,
        });
        console.log("FCM token saved for user:", userId);
      } else {
        // Update existing token
        const tokenDoc = existingTokens.docs[0];
        await updateDoc(doc(db, FCM_TOKENS_COLLECTION_NAME, tokenDoc.id), {
          isActive: true,
          updatedAt: serverTimestamp(),
        });
        console.log("FCM token updated for user:", userId);
      }
    } catch (error) {
      console.error("Error saving FCM token:", error);
      throw error;
    }
  }

  // Get all active tokens
  async getAllActiveTokens(): Promise<string[]> {
    try {
      const tokensRef = collection(db, FCM_TOKENS_COLLECTION_NAME);
      const q = query(tokensRef, where("isActive", "==", true));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => doc.data().token);
    } catch (error) {
      console.error("Error getting tokens:", error);
      return [];
    }
  }

  // Send notification to all users
  async sendNotificationToAll(
    notification: Omit<NotificationData, "id" | "createdAt">
  ): Promise<void> {
    try {
      // Save notification in Firestore
      const notificationData = {
        ...notification,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, NOTIFICATIONS_COLLECTION_NAME), notificationData);

      // Get all active tokens
      const tokens = await this.getAllActiveTokens();

      if (tokens.length === 0) {
        console.log("No tokens available to send notifications");
        return;
      }

      // Send notification using Cloud Function
      await this.callSendNotificationFunction({
        tokens,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
      });

      console.log(`Notification sent to ${tokens.length} devices`);
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  // Call Cloud Function to send notifications
  private async callSendNotificationFunction(payload: {
    tokens: string[];
    notification: { title: string; body: string };
    data: Record<string, any>;
  }): Promise<void> {
    try {
      const response = await fetch("/api/sendNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Cloud Function response:", result);
    } catch (error) {
      console.error("Error calling Cloud Function:", error);
      throw error;
    }
  }

  // Deactivate token (when user logs out)
  async deactivateUserTokens(userId: string): Promise<void> {
    try {
      const tokensRef = collection(db, FCM_TOKENS_COLLECTION_NAME);
      const q = query(tokensRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      const updatePromises = snapshot.docs.map((docSnapshot) =>
        updateDoc(doc(db, FCM_TOKENS_COLLECTION_NAME, docSnapshot.id), {
          isActive: false,
          deactivatedAt: serverTimestamp(),
        })
      );

      await Promise.all(updatePromises);
      console.log("Tokens deactivated for user:", userId);
    } catch (error) {
      console.error("Error deactivating tokens:", error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();