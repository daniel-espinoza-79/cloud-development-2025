import { Mail, Chrome, Facebook } from "lucide-react";
import type { ProviderType } from "@/types/auth.types";

export const PROVIDER_CONFIG = {
  email: {
    name: "Email",
    icon: Mail,
    color: "bg-gray-100 text-gray-800",
  },
  google: {
    name: "Google",
    icon: Chrome,
    color: "bg-blue-100 text-blue-800",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "bg-indigo-100 text-indigo-800",
  },
} as const;

export const getProviderConfig = (type: ProviderType) => PROVIDER_CONFIG[type];
