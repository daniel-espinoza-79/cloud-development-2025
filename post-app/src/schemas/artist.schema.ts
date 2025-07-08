import { z } from "zod";

export const artistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.any().optional(),
  genreId: z.string().min(1, "Genre is required"),
});

export type ArtistFormData = z.infer<typeof artistSchema>;
export default artistSchema;
