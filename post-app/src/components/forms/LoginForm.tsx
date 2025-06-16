import { useAuth } from "@/hooks/useAuth";
import type { SocialProvider } from "@/types/auth.types";
import {
  defaultLoginValues,
  loginSchema,
  type LoginFormData,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "../ui/Card";
import { LogIn, Mail } from "lucide-react";
import { Alert } from "../ui/Alert";
import { Input } from "../ui/Input";
import { PasswordInput } from "../ui/PasswordInput";
import { Button } from "../ui/Button";
import { SocialButton } from "../auth/SocialButton";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const { authState, login, loginWithProvider, clearError } = useAuth();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: defaultLoginValues,
  });

  const handleLoginSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    await loginWithProvider(provider);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="p-8 space-y-6">
        <h2 className="text-3xl text-center font-bold text-gray-900">Login</h2>

        {authState.error && (
          <Alert variant="error" onAbort={clearError}>
            {authState.error}
          </Alert>
        )}

        {authState.resolutionMessage && (
          <Alert variant="success">{authState.resolutionMessage}</Alert>
        )}

        <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
          <Input
            label="Email"
            placeholder="s2a2B@example.com"
            type="email"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email", { required: true })}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            error={errors.password?.message}
            {...register("password", { required: true })}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={authState.isLoading}
            disabled={!isValid}
            leftIcon={<LogIn className="h-4 w-4" />}
          >
            Login
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SocialButton
            provider="google"
            onClick={() => handleSocialLogin("google")}
            disabled={authState.isLoading}
          >
            Google
          </SocialButton>
          <SocialButton
            provider="facebook"
            onClick={() => handleSocialLogin("facebook")}
            disabled={authState.isLoading}
          >
            Facebook
          </SocialButton>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </Card>
  );
};
export default LoginForm;
