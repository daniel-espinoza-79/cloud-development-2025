import { useAuth } from "@/hooks/useAuth";
import type { ProviderType, SocialProvider } from "@/types/auth.types";
import { LogOut, Mail, MapPin, Calendar, Phone, Edit } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Alert } from "../ui/Alert";
import ProviderItem from "./ProviderItem";
import AddProviderItem from "./AddProviderItem";
import { fcmTokenService } from "@/services/fcmTokenService";

const UserProfile = () => {
  const navigate = useNavigate();
  const { authState, linkProvider, unlinkProvider, logout, clearError } =
    useAuth();
  const [unlinkingProvider, setUnlinkingProvider] =
    useState<SocialProvider | null>(null);
  const [linkingProvider, setLinkingProvider] = useState<SocialProvider | null>(
    null
  );

  const user = authState.user;
  if (!user)
    return <div className="text-center color-black">ADDING PROVIDER</div>;

  const handleLinkProvider = async (provider: SocialProvider) => {
    setLinkingProvider(provider);
    try {
      await linkProvider(provider);
    } finally {
      setLinkingProvider(null);
    }
  };

  const handleUnlinkProvider = async (provider: SocialProvider) => {
    setUnlinkingProvider(provider);
    try {
      await unlinkProvider(provider);
    } finally {
      setUnlinkingProvider(null);
    }
  };

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  const onLogout = async () => {
    localStorage.removeItem("fcm_token")
    fcmTokenService.deleteUserToken(user.id);
    await logout();
  };

  const linkedProviderTypes = user.providers.map((p) => p.type);
  const availableProviders: SocialProvider[] = ["google", "facebook"];
  const unlinkedProviders = availableProviders.filter(
    (p) => !linkedProviderTypes.includes(p)
  );

  const canUnlinkProvider = (provider: ProviderType) => {
    return user.providers.length > 1 && provider !== "email";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <div className="p-8">
          <div className="flex items-start justify-between flex-wrap mb-6">
            <div className="flex items-center gap-6">
              <div className="">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`Avatar de ${user.name}`}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mb-3">
                  <Mail className="h-5 w-5" />
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleEditProfile}
                leftIcon={<Edit className="h-4 w-4" />}
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                onClick={onLogout}
                leftIcon={<LogOut className="h-4 w-4" />}
                isLoading={authState.isLoading}
              >
                Sign Out
              </Button>
            </div>
          </div>

          {user.profile && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.profile.address && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">
                        {user.profile.address}
                      </p>
                    </div>
                  </div>
                )}

                {user.profile.birthDate && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Birth Date</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(user.profile.birthDate)}
                      </p>
                    </div>
                  </div>
                )}

                {user.profile.age !== undefined && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium text-gray-900">
                        {user.profile.age} years old
                      </p>
                    </div>
                  </div>
                )}

                {user.profile?.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">phone</p>
                      <p className="font-medium text-gray-900">
                        {user.profile?.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {!user.profile.address &&
                !user.profile.birthDate &&
                !user.profile.age && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      You haven't added additional information to your profile
                    </p>
                    <Button
                      variant="secondary"
                      onClick={handleEditProfile}
                      leftIcon={<Edit className="h-4 w-4" />}
                    >
                      Complete Profile
                    </Button>
                  </div>
                )}
            </div>
          )}
        </div>
      </Card>

      {authState.error && (
        <Alert variant="error" onAbort={clearError}>
          {authState.error}
        </Alert>
      )}

      <Card>
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
              Access Methods
            </h2>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              Active Methods ({user.providers.length})
            </h3>
            <div className="space-y-3">
              {user.providers.map((provider) => (
                <ProviderItem
                  key={provider.id}
                  provider={provider}
                  onUnlink={
                    provider.type !== "email"
                      ? () =>
                          handleUnlinkProvider(provider.type as SocialProvider)
                      : undefined
                  }
                  canUnlink={canUnlinkProvider(provider.type)}
                  isUnlinking={unlinkingProvider === provider.type}
                />
              ))}
            </div>
          </div>

          {unlinkedProviders.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                Add New Method
              </h3>
              <div className="space-y-3">
                {unlinkedProviders.map((provider) => (
                  <AddProviderItem
                    key={provider}
                    provider={provider}
                    onLink={() => handleLinkProvider(provider)}
                    isLinking={linkingProvider === provider}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
