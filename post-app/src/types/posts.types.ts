import type { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}