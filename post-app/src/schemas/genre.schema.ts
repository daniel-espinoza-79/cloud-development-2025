import { z } from "zod";
import { imagefileSchema } from "./file.schema";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: imagefileSchema.optional(),
});
export type ItemSchemaData = z.infer<typeof itemSchema>;
export default itemSchema;
