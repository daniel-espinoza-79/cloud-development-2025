import { useAuth } from "@/hooks/useAuth";
import type { ProviderType, SocialProvider } from "@/types/auth.types";
import { LogOut, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Alert } from "../ui/Alert";
import ProviderItem from "./ProviderItem";
import AddProviderItem from "./AddProviderItem";

const UserProfile = () => {
  const { authState, linkProvider, unlinkProvider, logout, clearError } =
    useAuth();
  const [unlinkingProvider, setUnlinkingProvider] =
    useState<SocialProvider | null>(null);
  const [linkingProvider, setLinkingProvider] = useState<SocialProvider | null>(
    null
  );


  const user = authState.user;
  if (!user) return <>
  <div className="text-center color-black">
    ADDING PROVIDER
  </div>
  </>;

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


  const linkedProviderTypes = user.providers.map((p) => p.type);
  const availableProviders: SocialProvider[] = ["google", "facebook"];
  const unlinkedProviders = availableProviders.filter(
    (p) => !linkedProviderTypes.includes(p)
  );

  const canUnlinkProvider = (provider: ProviderType) => {
    return user.providers.length > 1 && provider !== "email";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <div className="p-8">
          <div className="flex items-start justify-between flex-wrap">
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

            <Button
              variant="outline"
              onClick={logout}
              leftIcon={<LogOut className="h-4 w-4" />}
              isLoading={authState.isLoading}
            >
              Cerrar Sesión
            </Button>
          </div>
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
              Métodos de Acceso
            </h2>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              Métodos Activos ({user.providers.length})
            </h3>
            <div className="space-y-3">
              {user.providers.map((provider) => (
                <ProviderItem
                  key={provider.id}
                  provider={provider}
                  onUnlink={
                    provider.type !== "email"
                      ? () => handleUnlinkProvider(provider.type as SocialProvider)
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
