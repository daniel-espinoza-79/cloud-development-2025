/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-hot-toast";

class ToastInfo {
  message: string;
  description?: string | null;

  constructor(message: string, description: string | null = null) {
    this.message = message;
    this.description = description;
  }

  static success(
    message: string,
    description: string | null = null
  ): ToastInfo {
    return new ToastInfo(message, description);
  }

  static error(message: string, description: string | null = null): ToastInfo {
    return new ToastInfo(message, description);
  }

  toString(): string {
    return `${this.message}${
      this.description ? `<br>${this.description}` : ""
    }`;
  }
}

export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

export const showToast = (
  type: "success" | "error",
  message: string,
  description?: string
) => {
  toast[type](`${message}${description ? `<br>${description}` : ""}`);
};

export const showAsyncToast = <T>(
  fetch: Promise<T | null>,
  onSuccess: (t: T | null) => ToastInfo,
  onError: (e: any) => ToastInfo,
  operationType: string
) => {
  toast.promise(fetch, {
    loading: operationType,
    success: (t: T | null) => {
      const data = onSuccess(t);
      return `${data.message} ${data.message ? `\n${data.description}` : ""}`;
    },
    error: (e: any) => {
      const data = onError(e);
      return `${data.message} ${data.message ? `\n${data.description}` : ""}`;
    },
  });
};
