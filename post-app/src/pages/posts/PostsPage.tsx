import PostManagement from "@/components/posts/PostManagement";

const PostsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Posts Management
          </h1>
        </header>
        <PostManagement />
      </div>
    </div>
  );
};

export default PostsPage;
