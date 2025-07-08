import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  getDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

type Role = "admin" | "user";

export interface UsersRoleInfo {
  id: string;
  email: string;
  role: Role;
}

const USER_ROLES_COLLECTION = import.meta.env
  .VITE_FIREBASE_USER_ROLES_COLLECTION;

export interface IUserRoleService {
  createUserRole(userId: string, email: string, role: Role): Promise<void>;
  changeUserRole(userId: string, role: Role): Promise<void>;
  getAllUserRoles(): Promise<UsersRoleInfo[]>;
  isUserAdmin(userId: string): Promise<boolean>;
}

export class UserRoleService implements IUserRoleService {
  private collectionRef = collection(db, USER_ROLES_COLLECTION);

  async createUserRole(
    userId: string,
    email: string,
    role: Role
  ): Promise<void> {
    try {
      const userRoleDoc = doc(this.collectionRef, userId);
      const userData: UsersRoleInfo = {
        id: userId,
        email,
        role,
      };

      await setDoc(userRoleDoc, userData);
    } catch (error) {
      console.error("Error creating user role:", error);
      throw new Error("Failed to create user role");
    }
  }

  async changeUserRole(userId: string, role: Role): Promise<void> {
    try {
      const userRoleDoc = doc(this.collectionRef, userId);
      await updateDoc(userRoleDoc, { role });
    } catch (error) {
      console.error("Error updating user role:", error);
      throw new Error("Failed to update user role");
    }
  }

  async getAllUserRoles(): Promise<UsersRoleInfo[]> {
    try {
      const q = query(this.collectionRef);
      const querySnapshot = await getDocs(q);

      const userRoles: UsersRoleInfo[] = [];
      querySnapshot.forEach((doc) => {
        userRoles.push(doc.data() as UsersRoleInfo);
      });

      return userRoles;
    } catch (error) {
      console.error("Error fetching user roles:", error);
      throw new Error("Failed to fetch user roles");
    }
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    try {
/*       if (userId === "Ffndm6vXGqYpw2dxAGww1kkjAfD2") {
        return true;
      } */
      const userRoleDoc = doc(this.collectionRef, userId);
      const docSnapshot = await getDoc(userRoleDoc);

      if (!docSnapshot.exists()) {
        return false;
      }

      const userData = docSnapshot.data() as UsersRoleInfo;
      return userData.role === "admin";
    } catch (error) {
      console.error("Error checking user admin status:", error);
      throw new Error("Failed to check user admin status");
    }
  }
}

export const userRoleService = new UserRoleService();
