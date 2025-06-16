import { postSchema, type PostFormData } from "@/schemas/posts.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface PostFormProps {
  onSubmit: (data: PostFormData) => Promise<void>;
  onCancel: () => void;
}

const PostForm = ({ onSubmit, onCancel }: PostFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const handleFormSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onCancel();
    } catch (error) {
      console.error("Error al crear el post:", error);
      alert("Error al crear el post. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Título *
          </label>
          <input
            type="text"
            id="title"
            {...register("title")}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Ingresa un título atractivo para tu post"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contenido *
          </label>
          <textarea
            id="content"
            rows={6}
            {...register("content")}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-vertical ${
              errors.content ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Escribe el contenido de tu post aquí..."
          />
          {errors.content && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              {errors.content.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit(handleFormSubmit)}
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creando...
            </>
          ) : (
            "Crear Post"
          )}
        </button>
      </div>
    </div>
  );
};


export default PostForm;