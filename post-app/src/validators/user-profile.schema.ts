import { z } from "zod";
const userProfileSchema = z.object({
  address: z.string().optional().or(z.literal("")),
  birthDate: z
    .date()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age >= 0 && age <= 120;
      },
      {
        message: "Please enter a valid birth date",
      }
    ),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (phone) => {
        if (!phone || phone === "") return true;
        return /^\+?[\d\s\-()]+$/.test(phone);
      },
      {
        message: "Please enter a valid phone number",
      }
    ),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface UserProfileSchema {
  id?: string;
  address?: string;
  birthDate?: Date;
  age?: number;
  phone?: string;
}

export { userProfileSchema };    
export type { UserProfileFormData, UserProfileSchema };

