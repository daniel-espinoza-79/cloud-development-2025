export const DESIGN_TOKENS = {
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  radius: {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  },
  shadow: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  },
} as const;

export const BUTTON_STYLES = {
  base: "inline-flex items-center justify-center font-medium transition-colors focus:outline-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
  variants: {
    primary: "bg-gray-900 text-white hover:bg-gray-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    destructive_light:
      "text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2",
  },
  sizes: {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-11 px-8 text-base",
  },
} as const;

export const INPUT_STYLES = {
  base: "w-full h-10 px-3 border transition-colors disabled:opacity-50 focus:outline-none focus:ring-none",
  variants: {
    default: "border-gray-300 focus:border-blue-500",
    error: "border-red-300 focus:border-red-500",
  },
} as const;

export const CARD_STYLES = {
  base: "bg-white border rounded-lg shadow-sm",
  padding: {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  },
} as const;

export const ALERT_STYLES = {
  base: "flex items-start gap-3 p-4 rounded-lg border",
  variants: {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  },
} as const;
