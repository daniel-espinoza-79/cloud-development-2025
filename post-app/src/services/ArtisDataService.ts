import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/config/firebase.config";
import type { Artist } from "@/types/music.types";
import type { ItemSchemaData } from "@/schemas/genre.schema";
import type { IDataService } from "@/hooks/useData";
import { getFileNameFromUrl, getStoragePathFromUrl } from "@/utils/url.utils";

const COLLECTION_NAME = import.meta.env.VITE_FIREBASE_ARTISTS_COLLECTION;

class ArtistService implements IDataService<Artist, ItemSchemaData>  {
  genreId: string
  constructor( id: string) {
    this.genreId = id
  }

  async createData(data: ItemSchemaData): Promise<Artist | null> {
    try {
      const imageRef = ref(storage, `${COLLECTION_NAME}/${Date.now()}_${data.image!.name}`);
      await uploadBytes(imageRef, data.image!);
      const imageUrl = await getDownloadURL(imageRef);

      const artistData = {
        name: data.name,
        imageUrl,
        genreId: this.genreId,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), artistData);

      return {
        id: docRef.id,
        imageName: getFileNameFromUrl(imageUrl),
        ...artistData,
      };
    } catch (error) {
      console.error("Error creating artist:", error);
      return null;
    }
  }

  async updateData(id: string, data: ItemSchemaData): Promise<Artist> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);

      const currentDoc = await getDoc(docRef);
      const currentData = currentDoc.data() as Artist;

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

      const imageRef = ref(storage, `genres/${Date.now()}_${data.image!.name}`);
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
        genreId: currentData.genreId,
        imageUrl,
        createdAt: currentData.createdAt,
      };
    } catch (error) {
      console.error("Error updating artist:", error);
      throw error;
    }
  }

  async deleteData(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);

      const docSnap = await getDoc(docRef);
      const data = docSnap.data() as Artist;

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
      console.error("Error deleting artist:", error);
      throw error;
    }
  }

  async fetchData(): Promise<Artist[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("genreId", "==", this.genreId)
      );
  
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        imageName: getFileNameFromUrl(doc.data().imageUrl),
        ...doc.data(),
      })) as Artist[];
    } catch (error) {
      console.error("Error fetching artists:", error);
      return [];
    }
  }
};


export default ArtistService;