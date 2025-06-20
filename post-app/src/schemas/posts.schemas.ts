import { z } from "zod";

const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must not exceed 100 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .min(10, "Content must be at least 10 characters long")
    .max(2000, "Content must not exceed 2000 characters"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  imageName: z.string().optional().or(z.literal("")),
});

type PostFormData = z.infer<typeof postSchema>;

export { postSchema, type PostFormData };
