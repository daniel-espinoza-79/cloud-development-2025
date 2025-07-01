/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { userProfileService } from "@/services/UserProfileService";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { ArrowLeft, Save, User, MapPin, Calendar } from "lucide-react";
import {
  userProfileSchema,
  type UserProfileFormData,
} from "@/schemas/user-profile.schema";
import type { UpdateUserProfileData } from "@/types/auth.types";
import { Input } from "../ui/Input";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { authState, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const user = authState.user;

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isDirty },
    reset,
    setValue
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
      let birthDate = user.profile.birthDate;

      if (birthDate) {
        const date = new Date(birthDate);
        const year = date.getFullYear();
        if (isNaN(date.getTime()) || year < 1900 || year > 2100) {
          birthDate = undefined;
        }
      }

      reset({
        address: user.profile.address || "",
        birthDate: birthDate,
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

  const calculateAge = (birthDate: Date | undefined): number | null => {
    if (!birthDate) return null;

    let date: Date;
    if (typeof birthDate === "string") {
      date = new Date(birthDate);
    } else {
      date = birthDate;
    }

    if (isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    if (year < 1900 || year > new Date().getFullYear()) return null;

    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < date.getDate())
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
      }, 200);
    } catch (error: any) {
      setError(error.message || "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return "";

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();
    if (year < 1900 || year > 2100) {
      return "";
    }

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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
        </div>
      </div>
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
          <Input
            id="address"
            label="Address"
            leftIcon={<MapPin className="h-4 w-4" />}
            type="text"
            placeholder="Enter your address"
            {...register("address")}
            error={errors.address?.message}
          />
          <Input
            id="birthDate"
            label="Birth Date"
            leftIcon={<Calendar className="h-4 w-4" />}
            type="date"
            placeholder="Enter your address"
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                const [year, month, day] = value.split("-").map(Number);
                const date = new Date(year, month - 1, day);

                if (!isNaN(date.getTime()) && year >= 1900 && year <= 2100) {
                  setValue("birthDate", date, { shouldDirty: true });
                }
              } else {
                setValue("birthDate", undefined, { shouldDirty: true });
              }
            }}
            value={formatDateForInput(watchedBirthDate)}
            error={errors.birthDate?.message}
          />
          {watchedBirthDate && (
            <p className="text-sm text-gray-500">
              Age: {calculateAge(watchedBirthDate)} years old
            </p>
          )}
          <Input
            id="phone"
            label="Phone"
            leftIcon={<Calendar className="h-4 w-4" />}
            type="tel"
            placeholder="Enter Phone number"
            {...register("phone")}
            error={errors.phone?.message}
          />
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
