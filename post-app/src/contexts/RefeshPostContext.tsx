import { createContext, useContext, useState, useCallback } from "react";

interface PostsContextType {
  triggerUpdatePosts: () => void;
  triggerValue: object;
  thereAreNewPosts?: boolean;
  setThereAreNewPosts?: (value: boolean) => void;
}

const RefeshPostContext = createContext<PostsContextType | undefined>(
  undefined
);

export const RefreshPostProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [triggerValue, setTriggerValue] = useState({});
  const [thereAreNewPosts, setThereAreNewPosts] = useState(false);

  const triggerUpdatePosts = useCallback(() => {
    setTriggerValue({ timestamp: Date.now() });
  }, []);

  return (
    <RefeshPostContext.Provider
      value={{
        triggerUpdatePosts,
        triggerValue,
        thereAreNewPosts,
        setThereAreNewPosts,
      }}
    >
      {children}
    </RefeshPostContext.Provider>
  );
};

export const usePostsTrigger = (): PostsContextType => {
  const context = useContext(RefeshPostContext);
  if (!context) {
    throw new Error("usePostsTrigger must be used within a PostsProvider");
  }
  return context;
};
