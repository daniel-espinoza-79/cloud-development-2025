import { Button } from "./Button";
import Label from "./Label";
import { useRef, useMemo } from "react";

interface FileInputProps {
  label: string;
  accept: "image/*" | "audio/*" | "video/*" | "audio/mp3";
  onChange: (file: File | null) => void;
  error?: string;
  required?: boolean;
  limitMb?: number;
  initialFileName?: string;
}

const FileInput = ({
  label,
  accept,
  onChange,
  error,
  required = false,
  limitMb = 5,
  initialFileName,
}: FileInputProps) => {
  const selectedFileName = useMemo(() => {
    if (initialFileName) {
      return initialFileName;
    }
    return null;
  }, [initialFileName]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      if (file.size > limitMb * 1024 * 1024) {
        onChange(null);
        return;
      }

      if (!file.type.startsWith(accept.slice(0, -1))) {
        onChange(null);
        return;
      }
      onChange(file);
    }
  };

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange(null);
  };

  return (
    <div className="mb-4">
      <Label required={required}>{label}</Label>

      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className={`w-full px-3 py-2 border rounded-md placeholder:text-gray-100 focus:outline-none focus:ring-1 focus:ring-green-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          required={required}
        />

        {selectedFileName && (
          <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded border">
            <span className="text-sm text-gray-700 truncate">
              📎 {selectedFileName}
            </span>
            <Button
              size="sm"
              variant="destructive"
              type="button"
              onClick={clearFile}
            >
              Remove
            </Button>
          </div>
        )}
      </div>

      <p className="mt-1 text-xs text-gray-500">
        {`Accepted file types: ${accept}. Max size: ${limitMb}MB`}
      </p>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileInput;
