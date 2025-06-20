import { postSchema, type PostFormData } from "@/schemas/posts.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/Input";
import TextArea from "../ui/TextArea";
import { Button } from "../ui/Button";

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
        <Input
          label="Title *"
          error={errors.title?.message}
          {...register("title")}
          id="title"
          placeholder="Insert a title"
          type="text"
        />
        <TextArea
          label="Content *"
          error={errors.content?.message}
          {...register("content")}
          id="content"
          placeholder="Insert a content"
          type="text"
          className="min-h-[140px]"
        />
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creando...
            </>
          ) : (
            "Crear Post"
          )}
        </Button>
      </div>
    </div>
  );
};


export default PostForm;