import { songSchema, type SongFormData } from "@/schemas/song.schema";
import type { Song } from "@/types/music.types";
import { createEmptyImageFile } from "@/utils/parsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/Input";
import FileInput from "../ui/FileInput";
import { Button } from "../ui/Button";

interface SongFormProps {
  onClose: () => void;
  initialValue: Song | null;
  onSubmit: (data: SongFormData) => void;
  entryName: string;
}

const SongForm = ({
  onClose,
  initialValue,
  onSubmit,
  entryName,
}: SongFormProps) => {
  const {
    formState: { isValid, errors },
    handleSubmit,
    setValue,
    register,
    trigger,
  } = useForm<SongFormData>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      name: initialValue ? initialValue.name : "",
      audio: initialValue ? createEmptyImageFile() : undefined,
    },
  });
  const [fileName, setFileName] = useState<string | undefined>(
    initialValue?.audioFimeName
  );

  const updateMode = initialValue !== null;

  const handleFileChange = async (file: File | null) => {
    setValue("audio", file || undefined);
    setFileName(file?.name);
    if (file) {
      await trigger("audio");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label={`${entryName} Name`}
        {...register("name")}
        placeholder={`Enter ${entryName} name`}
        error={errors.name?.message}
        required
      />
      <FileInput
        label={`${entryName} Audio File`}
        accept="audio/mp3"
        onChange={handleFileChange}
        error={errors.audio?.message}
        initialFileName={fileName ?? undefined}
        required
      />
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" type="submit" disabled={!isValid}>
          {updateMode ? `Update ${entryName}` : `Create ${entryName}`}
        </Button>
      </div>
    </form>
  );
};

export default SongForm;
