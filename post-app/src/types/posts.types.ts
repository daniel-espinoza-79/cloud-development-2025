import type { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  userId: string;
  username: string;
  imageUrl?: string;
  imageName?:string;
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}