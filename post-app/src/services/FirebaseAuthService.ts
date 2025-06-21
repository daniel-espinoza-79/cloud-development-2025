/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  linkWithPopup,
  unlink,
  signOut,
  updateProfile,
  type User as FirebaseUser,
  type UserCredential,
  type AuthProvider as FirebaseAuthProvider,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "@/config/firebase.config";
import type { User, SocialProvider } from "@/types/auth.types";
import { userProfileService } from "./UserProfileService";

export class FirebaseAuthService {
  async registerWithEmail(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      return await this.mapFirebaseUserToUser(userCredential.user);
    } catch (error: any) {
      throw this.createAuthError(error);
    }
  }

  async loginWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return await this.mapFirebaseUserToUser(userCredential.user);
    } catch (error: any) {
      throw this.createAuthError(error);
    }
  }

  async loginWithProvider(provider: SocialProvider): Promise<User> {
    try {
      const authProvider = this.getFirebaseProvider(provider);
      const result: UserCredential = await signInWithPopup(auth, authProvider);

      return await this.mapFirebaseUserToUser(result.user);
    } catch (error: any) {
      throw this.createAuthError(error);
    }
  }

  async linkProvider(provider: SocialProvider): Promise<User> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("There is no user logged in");
      }

      const isAlreadyLinked = currentUser.providerData.some(
        (p) => p.providerId === this.getProviderString(provider)
      );

      if (isAlreadyLinked) {
        throw new Error(
          `${this.getProviderDisplayName(provider)} is already linked`
        );
      }

      const authProvider = this.getFirebaseProvider(provider);
      const result = await linkWithPopup(currentUser, authProvider);

      return await this.mapFirebaseUserToUser(result.user);
    } catch (error: any) {
      throw this.createAuthError(error);
    }
  }

  async unlinkProvider(provider: SocialProvider): Promise<User> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No hay usuario autenticado");
      }

      if (currentUser.providerData.length <= 1) {
        throw new Error("Cannot unlink last provider");
      }

      const providerId = this.getProviderString(provider);
      const result = await unlink(currentUser, providerId);

      return await this.mapFirebaseUserToUser(result);
    } catch (error: any) {
      throw this.createAuthError(error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    return firebaseUser ? await this.mapFirebaseUserToUser(firebaseUser) : null;
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.createAuthError(error);
    }
  }

  private async mapFirebaseUserToUser(
    firebaseUser: FirebaseUser
  ): Promise<User> {
    try {
      const profile = await userProfileService.ensureUserProfile(
        firebaseUser.uid
      );

      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "",
        avatar: firebaseUser.photoURL || undefined,
        providers: this.mapFirebaseProviders(firebaseUser.providerData),
        createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
        profile,
      };
    } catch (error) {
      console.error("Error mapping user:", error);
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "",
        avatar: firebaseUser.photoURL || undefined,
        providers: this.mapFirebaseProviders(firebaseUser.providerData),
        createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
        profile: undefined,
      };
    }
  }

  private mapFirebaseProviders(providerData: any[]): any[] {
    return providerData.map((provider) => ({
      id: `${provider.providerId}-${provider.uid}`,
      type: this.mapProviderIdToType(provider.providerId),
      providerId: provider.uid,
      email: provider.email || "",
      name: provider.displayName || "",
      linkedAt: new Date(),
    }));
  }

  private getFirebaseProvider(provider: SocialProvider): FirebaseAuthProvider {
    switch (provider) {
      case "google":
        return googleProvider;
      case "facebook":
        return facebookProvider;
      default:
        throw new Error(`Provider not supported: ${provider}`);
    }
  }

  private getProviderString(provider: SocialProvider): string {
    switch (provider) {
      case "google":
        return "google.com";
      case "facebook":
        return "facebook.com";
      default:
        throw new Error(`Provider not supported: ${provider}`);
    }
  }

  private getProviderDisplayName(provider: SocialProvider): string {
    switch (provider) {
      case "google":
        return "Google";
      case "facebook":
        return "Facebook";
      default:
        return provider;
    }
  }

  private mapProviderIdToType(providerId: string): string {
    switch (providerId) {
      case "google.com":
        return "google";
      case "facebook.com":
        return "facebook";
      case "password":
        return "email";
      default:
        return "unknown";
    }
  }

  private createAuthError(error: any): Error {
    const errorMessages: Record<string, string> = {
      "auth/email-already-in-use": "This email is already registered",
      "auth/invalid-email": "Invalid email",
      "auth/weak-password": "Password must be at least 6 characters",

      "auth/user-not-found": "No account exists with this email",
      "auth/wrong-password": "Incorrect password",
      "auth/invalid-credential": "Invalid credentials",
      "auth/user-disabled": "This account has been disabled",

      "auth/popup-closed-by-user": "Authentication window was closed",
      "auth/popup-blocked": "Popup blocked. Please allow popups for this site",
      "auth/redirect-cancelled-by-user": "Authentication was cancelled",
      "auth/account-exists-with-different-credential":
        "An account already exists with this email. Use the original sign-in method",
      "auth/credential-already-in-use":
        "This social account is already linked to another user",
      "auth/provider-already-linked":
        "This provider is already linked to your account",

      "auth/network-request-failed": "Connection error. Check your internet",
      "auth/too-many-requests":
        "Too many failed attempts. Please try again later",

      "auth/operation-not-allowed": "Operation not allowed",
      "auth/requires-recent-login":
        "You need to re-authenticate for this action",
    };

    const message =
      errorMessages[error.code] || error.message || "Error desconocido";

    console.error("Firebase Auth Error:", {
      code: error.code,
      originalMessage: error.message,
      mappedMessage: message,
    });

    return new Error(message);
  }
}

export const authService = new FirebaseAuthService();
