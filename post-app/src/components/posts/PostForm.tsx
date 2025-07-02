import { postSchema, type PostFormData } from "@/schemas/posts.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/Input";
import TextArea from "../ui/TextArea";
import { Button } from "../ui/Button";
import ImageUpload from "./ImageUploads";
import { fileService } from "@/services/FileService";

interface PostFormProps {
  onSubmit: (data: PostFormData) => Promise<void>;
  onCancel: () => void;
}

const PostForm = ({ onSubmit, onCancel }: PostFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setValue("imageUrl", "");
    }
  };


  const handleFormSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);

    try {
      let imageUrl = "";
      let imageName = "";
      if (selectedImage) {
        const uploadResult = await fileService.uploadImage(selectedImage);
        imageUrl = uploadResult.url;
        imageName = uploadResult.fileName;
      }
      const postData: PostFormData = {
        ...data,
        imageUrl: imageUrl || undefined,
        imageName : imageName 
      };

      console.log(postData)

      await onSubmit(postData);

      reset();
      setSelectedImage(null);
      setImagePreview(null);
      onCancel();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        Create a Post
      </h2>

      <div className="space-y-6">
        <Input
          label="Title *"
          error={errors.title?.message}
          {...register("title")}
          id="title"
          placeholder="¿What's on your mind?"
          type="text"
        />

        <TextArea
          label="Content *"
          error={errors.content?.message}
          {...register("content")}
          id="content"
          placeholder="Write something..."
          className="min-h-[120px]"
        />

        <ImageUpload
          onImageChange={handleImageChange}
          preview={imagePreview}
          error={errors.imageUrl?.message}
        />
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6"
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit(handleFormSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {selectedImage ? "Uploading..." : "Publishing..."}
            </>
          ) : (
            "Publish"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PostForm;
