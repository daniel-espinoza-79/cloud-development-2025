export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly avatar?: string;
  isAdmin?: boolean;
  readonly providers: readonly AuthProvider[];
  readonly createdAt: Date;
}

export interface AuthProvider {
  readonly id: string;
  readonly type: ProviderType;
  readonly providerId: string;
  readonly email: string;
  readonly name: string;
  readonly linkedAt: Date;
}

export type ProviderType = "email" | "google" | "facebook";
export type SocialProvider = "google" | "facebook";

export interface AuthState {
  readonly user: User | null;
  readonly isLoading: boolean;
  readonly isAuthenticated: boolean;
  readonly error: string | null;
  readonly resolutionMessage: string | null;
}

export interface AuthContextValue {
  readonly authState: AuthState;
  readonly register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  readonly login: (email: string, password: string) => Promise<void>;
  readonly loginWithProvider: (
    provider: SocialProvider,
    operation?: "login" | "register"
  ) => Promise<void>;
  readonly linkProvider: (provider: SocialProvider) => Promise<void>;
  readonly unlinkProvider: (provider: SocialProvider) => Promise<void>;
  readonly logout: () => Promise<void>;
  readonly clearError: () => void;
}
