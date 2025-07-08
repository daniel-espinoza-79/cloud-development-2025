import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/config/firebase.config";
import type { Genre } from "@/types/music.types";
import type { ItemSchemaData } from "@/schemas/genre.schema";
import type { IDataService } from "@/hooks/useData";
import { getFileNameFromUrl, getStoragePathFromUrl } from "@/utils/url.utils";

const COLLECTION_NAME = import.meta.env.VITE_FIREBASE_GENRES_COLLECTION;

export const genreService: IDataService<Genre, ItemSchemaData> = {
  async createData(data: ItemSchemaData): Promise<Genre | null> {
    try {
      const imageRef = ref(storage, `${COLLECTION_NAME}/${Date.now()}_${data.image!.name}`);
      await uploadBytes(imageRef, data.image!);
      const imageUrl = await getDownloadURL(imageRef);

      const genreData = {
        name: data.name,
        imageUrl,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), genreData);

      return {
        id: docRef.id,
        imageName: getFileNameFromUrl(imageUrl),
        ...genreData,
      };
    } catch (error) {
      console.error("Error creating genre:", error);
      return null;
    }
  },

  async updateData(id: string, data: ItemSchemaData): Promise<Genre> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);

      const currentDoc = await getDoc(docRef);
      const currentData = currentDoc.data() as Genre;

      if (currentData.imageUrl) {
        const oldImagePath = getStoragePathFromUrl(currentData.imageUrl);
        if (oldImagePath) {
          const oldImageRef = ref(storage, oldImagePath);
          try {
            await deleteObject(oldImageRef);
          } catch (error) {
            console.warn("Could not delete old image:", error);
          }
        }
      }

      const imageRef = ref(
        storage,
        `${COLLECTION_NAME}/${Date.now()}_${data.image!.name}`
      );
      await uploadBytes(imageRef, data.image!);
      const imageUrl = await getDownloadURL(imageRef);

      const updateData = {
        name: data.name,
        imageUrl,
      };

      await updateDoc(docRef, updateData);

      return {
        id,
        name: data.name,
        imageName: getFileNameFromUrl(imageUrl),
        imageUrl,
        createdAt: currentData.createdAt,
      };
    } catch (error) {
      console.error("Error updating genre:", error);
      throw error;
    }
  },

  async deleteData(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);

      const docSnap = await getDoc(docRef);
      const data = docSnap.data() as Genre;

      if (data.imageUrl) {
        const imagePath = getStoragePathFromUrl(data.imageUrl);
        if (imagePath) {
          const imageRef = ref(storage, imagePath);
          try {
            await deleteObject(imageRef);
          } catch (error) {
            console.warn("Could not delete image:", error);
          }
        }
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting genre:", error);
      throw error;
    }
  },

  async fetchData(): Promise<Genre[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        imageName: getFileNameFromUrl(doc.data().imageUrl),
        ...doc.data(),
      })) as Genre[];
    } catch (error) {
      console.error("Error fetching genres:", error);
      return [];
    }
  },
};
