import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

export interface UserTokenData {
  email: string;
  token: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastUpdated?: any;
}

class FCMTokenServiceImpl {
  private readonly COLLECTION_NAME = "user_fcm_tokens";

  async addToken(
    userId: string,
    email: string,
    token: string
  ): Promise<void> {
    try {
      const userTokenRef = doc(db, this.COLLECTION_NAME, userId);
      const docSnap = await getDoc(userTokenRef);
      const exists = docSnap.exists();

      const tokenData: UserTokenData = {
        token,
        email,
        lastUpdated: serverTimestamp(),
      };

      if (exists) {
        await setDoc(userTokenRef, tokenData, { merge: true });
      } else {
        await setDoc(userTokenRef, tokenData);
      }
    } catch (error) {
      console.error("Error adding/updating FCM token:", error);
      throw new Error(`Failed to add/update FCM token: ${error}`);
    }
  }
  async getUserToken(userId: string): Promise<UserTokenData | null> {
    try {
      const userTokenRef = doc(db, this.COLLECTION_NAME, userId);
      const docSnap = await getDoc(userTokenRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserTokenData;
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
      throw new Error(`Failed to get FCM token: ${error}`);
    }
  }

  async deleteUserToken(userId: string): Promise<void> {
    try {
      const userTokenRef = doc(db, this.COLLECTION_NAME, userId);
      await deleteDoc(userTokenRef);
    } catch (error) {
      console.error("Error deleting FCM token:", error);
      throw new Error(`Failed to delete FCM token: ${error}`);
    }
  }

  async getUserByToken(
    token: string
  ): Promise<{ userId: string; data: UserTokenData } | null> {
    try {
      const tokensRef = collection(db, this.COLLECTION_NAME);
      const q = query(tokensRef, where("token", "==", token));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data() as UserTokenData;
        return {
          userId: doc.id,
          data,
        };
      } else {
        console.error("No user found for this FCM token");
        return null;
      }
    } catch (error) {
      console.error("Error searching user by token:", error);
      throw new Error(`Failed to search user by token: ${error}`);
    }
  }

  async isTokenRegistered(token: string): Promise<boolean> {
    try {
      const result = await this.getUserByToken(token);
      return result !== null;
    } catch (error) {
      console.error("Error checking if token is registered:", error);
      return false;
    }
  }
}

export const fcmTokenService = new FCMTokenServiceImpl();
