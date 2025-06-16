import { z } from "zod";
const postSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede exceder 100 caracteres"),
  content: z
    .string()
    .min(1, "El contenido es requerido")
    .min(10, "El contenido debe tener al menos 10 caracteres")
    .max(2000, "El contenido no puede exceder 2000 caracteres"),
});

type PostFormData = z.infer<typeof postSchema>;

export { postSchema, type PostFormData };
