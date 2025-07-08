import { z } from "zod";

export const imagefileSchema = z
  .instanceof(File)
  .refine((file) => file && file.size <= 5 * 1024 * 1024, {
    message: "File size must be less than 5MB",
  })
  .refine((file) => file && file.type.startsWith("image/"), {
    message: "Only image files are allowed",
  });

export const audioFileSchema = z
  .instanceof(File)
  .optional()
  .refine((file) => file && file.size <= 5 * 1024 * 1024, {
    message: "File size must be less than 5MB",
  })
  .refine((file) => file && file.type.startsWith("audio/"), {
    message: "Only audio files are allowed",
  });
