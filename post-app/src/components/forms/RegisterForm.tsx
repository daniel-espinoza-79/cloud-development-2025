import type { SocialProvider } from "@/types/auth.types";
import { SocialButton } from "../auth/SocialButton";
import { Card } from "../ui/Card";
import { Mail, User, UserPlus } from "lucide-react";
import { Alert } from "../ui/Alert";
import { Input } from "../ui/Input";
import { PasswordInput } from "../ui/PasswordInput";
import { Button } from "../ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultRegisterValues,
  registerSchema,
  type RegisterFormData,
} from "@/schemas/auth.schema";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const {
    authState,
    loginWithProvider,
    clearError,
    register: registerUser,
  } = useAuth();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: defaultRegisterValues,
  });

  const handleSocialRegister = async (provider: SocialProvider) => {
    await loginWithProvider(provider);
  };

  const handleFormSubmit = async (data: RegisterFormData) => {
    await registerUser(data.name, data.email, data.password);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="p-8 space-y-6">
        <h2 className="text-3xl text-center font-bold text-gray-900">Create an account</h2>
        {authState.error && (
          <Alert variant="error" onAbort={clearError}>
            {authState.error}
          </Alert>
        )}

        {authState.resolutionMessage && (
          <Alert variant="success">{authState.resolutionMessage}</Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Juan Pérez"
            type="text"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register("name", { required: true })}
          />

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

          <PasswordInput
            label="Confirm Password"
            placeholder="Your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", { required: true })}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={authState.isLoading}
            disabled={!isValid}
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            Create account
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
            onClick={() => handleSocialRegister("google")}
            disabled={authState.isLoading}
          >
            Google
          </SocialButton>
          <SocialButton
            provider="facebook"
            onClick={() => handleSocialRegister("facebook")}
            disabled={authState.isLoading}
          >
            Facebook
          </SocialButton>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            already have an account{" "}
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RegisterForm;
