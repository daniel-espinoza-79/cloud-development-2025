import { z } from "zod";
import { audioFileSchema } from "./file.schema";

export const songSchema = z.object({
  name: z.string().min(1, "Name is required"),
  audio: audioFileSchema.optional(),
});

export type SongFormData = z.infer<typeof songSchema>;
export default songSchema;
