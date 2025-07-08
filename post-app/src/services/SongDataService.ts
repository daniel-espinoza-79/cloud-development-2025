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
import type { Song } from "@/types/music.types";
import type { ItemSchemaData } from "@/schemas/genre.schema";
import type { IDataService } from "@/hooks/useData";
import { getFileNameFromUrl, getStoragePathFromUrl } from "@/utils/url.utils";
import type { SongFormData } from "@/schemas/song.schema";

const COLLECTION_NAME = import.meta.env.VITE_FIREBASE_SONGS_COLLECTION;

class SongService implements IDataService<Song, ItemSchemaData> {
  artistId: string;
  constructor(id: string) {
    this.artistId = id;
  }

  async createData(data: SongFormData): Promise<Song | null> {
    try {
      const audioRef = ref(
        storage,
        `${COLLECTION_NAME}/${Date.now()}_${data.audio!.name}`
      );
      await uploadBytes(audioRef, data.audio!);
      const audioUrl = await getDownloadURL(audioRef);

      const songData = {
        name: data.name,
        audioUrl,
        artistId: this.artistId,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), songData);

      return {
        id: docRef.id,
        audioFimeName: getFileNameFromUrl(audioUrl),
        ...songData,
      };
    } catch (error) {
      console.error("Error creating song:", error);
      return null;
    }
  }

  async updateData(id: string, data: SongFormData): Promise<Song> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);

      const currentDoc = await getDoc(docRef);
      const currentData = currentDoc.data() as Song;

      if (currentData.audioUrl) {
        const oldAudioPath = getStoragePathFromUrl(currentData.audioUrl);
        if (oldAudioPath) {
          const oldAudioRef = ref(storage, oldAudioPath);
          try {
            await deleteObject(oldAudioRef);
          } catch (error) {
            console.warn("Could not delete old audio:", error);
          }
        }
      }

      const audioRef = ref(
        storage,
        `${COLLECTION_NAME}/${Date.now()}_${data.audio!.name}`
      );
      await uploadBytes(audioRef, data.audio!);
      const audioUrl = await getDownloadURL(audioRef);

      const updateData = {
        name: data.name,
        audioUrl,
      };

      await updateDoc(docRef, updateData);

      return {
        id,
        name: data.name,
        audioFimeName: getFileNameFromUrl(audioUrl),
        artistId: currentData.artistId,
        audioUrl,
        createdAt: currentData.createdAt,
      };
    } catch (error) {
      console.error("Error updating song:", error);
      throw error;
    }
  }

  async deleteData(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);

      const docSnap = await getDoc(docRef);
      const data = docSnap.data() as Song;

      if (data.audioUrl) {
        const songPath = getStoragePathFromUrl(data.audioUrl);
        if (songPath) {
          const songRef = ref(storage, songPath);
          try {
            await deleteObject(songRef);
          } catch (error) {
            console.warn("Could not delete audio:", error);
          }
        }
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting genre:", error);
      throw error;
    }
  }

  async fetchData(): Promise<Song[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("artistId", "==", this.artistId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        audioFimeName: getFileNameFromUrl(doc.data().audioUrl),
        ...doc.data(),
      })) as Song[];
    } catch (error) {
      console.error("Error fetching songs:", error);
      return [];
    }
  }
}

export default SongService;
