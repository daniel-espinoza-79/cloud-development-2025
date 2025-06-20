import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/config/firebase.config";

export class FileService {
  private generateFileName(file: File): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const extension = file.name.split(".").pop();
    return `${timestamp}_${randomId}.${extension}`;
  }

  private extractFileNameFromUrl(url: string): string {
    try {
      const decodedUrl = decodeURIComponent(url);
      const matches = decodedUrl.match(/posts%2F([^?]+)/);
      return matches ? matches[1] : "";
    } catch (error) {
      console.error("Error extracting filename from URL:", error);
      return "";
    }
  }

  async uploadImage(file: File): Promise<{ url: string; fileName: string }> {
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size must be less than 5MB");
      }

      const fileName = this.generateFileName(file);

      const storageRef = ref(storage, `posts/${fileName}`);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        url: downloadURL,
        fileName: fileName,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error uploading image"
      );
    }
  }

  async deleteImage(imageName?: string): Promise<void> {
    try {
      if (!imageName) {
       return;
      }
      let fileName = imageName;
      if (imageName.startsWith("https://")) {
        fileName = this.extractFileNameFromUrl(imageName);
        if (!fileName) {
          throw new Error("Could not extract filename from URL");
        }
      } else {
        fileName = imageName;
      }
      const storageRef = ref(storage, `posts/${fileName}`);
      await deleteObject(storageRef);
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error deleting image"
      );
    }
  }
}

export const fileService = new FileService();
