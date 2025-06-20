import { X } from "lucide-react";
import FileInput from "../ui/FileInput";

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  preview?: string | null;
  error?: string;
}

const ImageUpload = ({ onImageChange, preview, error }: ImageUploadProps) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      onImageChange(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (type: image/*)");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    onImageChange(file);
  };

  const handleRemoveImage = () => {
    onImageChange(null);
  };

  return (
    <div className="space-y-3">
      <FileInput
        label="Imagen del post (opcional)"
        accept="image/*"
        onChange={handleFileSelect}
        error={error}
      />

      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
            title="Eliminar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {preview && (
        <p className="text-sm text-gray-500">
          Click on the X icon to remove
        </p>
      )}
    </div>
  );
};

export default ImageUpload;

