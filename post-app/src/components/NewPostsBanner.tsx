import { usePostsTrigger } from "@/contexts/RefeshPostContext";

const NewPostsBanner = () => {
  const { thereAreNewPosts, triggerUpdatePosts, setThereAreNewPosts } =
    usePostsTrigger();
  console.log("NewPostsBanner rendered", { thereAreNewPosts });

  if (!thereAreNewPosts) {
    return null;
  }

  const handleNewPostsRefresh = () => {
    triggerUpdatePosts();
    setThereAreNewPosts?.(false);
  };

  return (
    <div
      className="h-5 bg-green-600 w-full fixed top-0 left-0 right-0 z-50 flex items-center justify-center cursor-pointer"
      onClick={handleNewPostsRefresh}
    >
      <p className="text-center text-white-500">There are new posts!</p>
    </div>
  );
};

export default NewPostsBanner;
