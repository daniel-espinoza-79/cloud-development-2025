import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { userProfileService } from "@/services/UserProfileService";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { ArrowLeft, Save, User, MapPin, Calendar, Phone } from "lucide-react";
import {
  userProfileSchema,
  type UserProfileFormData,
} from "@/schemas/user-profile.schema";
import type { UpdateUserProfileData } from "@/types/auth.types";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { authState, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const user = authState.user;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      address: "",
      birthDate: undefined,
      phone: "",
    },
  });

  const watchedBirthDate = watch("birthDate");

  useEffect(() => {
    if (user?.profile) {
      reset({
        address: user.profile.address || "",
        birthDate: user.profile.birthDate,
        phone: user.profile.phone || "",
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (isDirty) {
      setError(null);
      setSuccess(null);
    }
  }, [isDirty]);

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const calculateAge = (birthDate: Date | undefined): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  const onSubmit = async (data: UserProfileFormData) => {
    console.log(data);
    if (!user) {
      setError("No authenticated user");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const dataToUpdate: UpdateUserProfileData = {};

      if (data.address?.trim()) {
        dataToUpdate.address = data.address.trim();
      }

      if (data.birthDate) {
        dataToUpdate.birthDate = data.birthDate;
      }

      if (data.phone?.trim()) {
        dataToUpdate.phone = data.phone.trim();
      }

      const profileUpdated = await userProfileService.updateUserProfile(
        user.id,
        dataToUpdate
      );

      if (updateUserProfile && profileUpdated) {
        updateUserProfile(profileUpdated);
      }

      setSuccess("Profile updated successfully");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/profile");
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <div className="p-8 text-center">
            <p className="text-gray-500">
              You must be authenticated to edit your profile
            </p>
            <Button onClick={() => navigate("/login")} className="mt-4">
              Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600">Update your personal information</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="error" onAbort={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onAbort={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h3>

          {/* Address Field */}
          <div className="space-y-2">
            <label
              htmlFor="address"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <MapPin className="h-4 w-4" />
              Address
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <input
                  id="address"
                  type="text"
                  {...field}
                  value={field.value || ""}
                  placeholder="Enter your address"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Birth Date Field */}
          <div className="space-y-2">
            <label
              htmlFor="birthDate"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Calendar className="h-4 w-4" />
              Birth Date
            </label>
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <input
                  id="birthDate"
                  type="date"
                  value={formatDateForInput(field.value)}
                  onChange={(e) => {
                    const value = e.target.value;
                    const date = value ? new Date(value) : undefined;
                    field.onChange(date);
                  }}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.birthDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.birthDate && (
              <p className="text-sm text-red-600">{errors.birthDate.message}</p>
            )}
            {watchedBirthDate && (
              <p className="text-sm text-gray-500">
                Age: {calculateAge(watchedBirthDate)} years old
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Phone className="h-4 w-4" />
              Phone
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <input
                  id="phone"
                  type="tel"
                  {...field}
                  value={field.value || ""}
                  placeholder="Enter your phone number"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              isLoading={isLoading}
              leftIcon={<Save className="h-4 w-4" />}
              className="flex-1"
              disabled={!isDirty}
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProfilePage;
