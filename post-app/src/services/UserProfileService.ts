/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type DocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import type {  Profile, UpdateUserProfileData } from "@/types/auth.types";

export class UserProfileService {
  private readonly COLLECTION_NAME = "users-profile";

  async createUserProfile(
    userId: string,
    profileData: UpdateUserProfileData
  ): Promise<Profile> {
    try {
      const userProfileRef = doc(db, this.COLLECTION_NAME, userId);

      const age = profileData.birthDate
        ? this.calculateAge(profileData.birthDate)
        : undefined;

      const profileToSave = {
        ...profileData,
        age,
      };

      await setDoc(userProfileRef, profileToSave);
      return {
        id: userId,
        ...profileData,
        age: age,
      };
    } catch (error: any) {
      console.error("Error creating user profile:", error);
      throw new Error(`Error creating user profile: ${error.message}`);
    }
  }

  async getUserProfile(userId: string): Promise<Profile | null> {
    try {
      const userProfileRef = doc(db, this.COLLECTION_NAME, userId);
      const docSnap: DocumentSnapshot<DocumentData> = await getDoc(
        userProfileRef
      );

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: userId,
          address: data.address,
          birthDate: data.birthDate?.toDate(),
          age : data.age,
          phone: data.phone,
        };
      } else {
        return null;
      }
    } catch (error: any) {
      console.error("Error getting user profile:", error);
      throw new Error(`Error getting user profile: ${error.message}`);
    }
  }

  async updateUserProfile(
    userId: string,
    profileData: UpdateUserProfileData
  ): Promise<Profile> {
    try {

      const userProfileRef = doc(db, this.COLLECTION_NAME, userId);

      const docSnap = await getDoc(userProfileRef);
      if (!docSnap.exists()) {
       return await this.createUserProfile(userId, profileData);
      }

      const age = profileData.birthDate
        ? this.calculateAge(profileData.birthDate)
        : undefined;

      const updateData = {
        ...profileData,
        ...(age !== undefined && { age }),
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userProfileRef, updateData);
      const updatedProfile = await this.getUserProfile(userId);

      if (!updatedProfile) {
        throw new Error("Failed to retrieve updated profile");
      }

      return updatedProfile;
    } catch (error: any) {
      throw new Error(`Error updating user profile: ${error.message}`);
    }
  }

  async deleteUserProfile(userId: string): Promise<void> {
    try {
      const userProfileRef = doc(db, this.COLLECTION_NAME, userId);
      await updateDoc(userProfileRef, {
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error("Error deleting user profile:", error);
      throw new Error(`Error deleting user profile: ${error.message}`);
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  async ensureUserProfile(userId: string): Promise<Profile> {
    try {
      let profile = await this.getUserProfile(userId);

      if (!profile) {
        profile = await this.createUserProfile(userId, {});
      }

      return profile;
    } catch (error: any) {
      console.error("Error ensuring user profile:", error);
      throw error;
    }
  }
}

export const userProfileService = new UserProfileService();
