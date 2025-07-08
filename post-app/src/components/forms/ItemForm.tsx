import { Button } from "@/components/ui/Button";
import FileInput from "@/components/ui/FileInput";
import { Input } from "@/components/ui/Input";
import itemSchema, { type ItemSchemaData } from "@/schemas/genre.schema";
import { createEmptyImageFile } from "@/utils/parsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface DefaultItem{
  name: string;
  imageName: string;
}

interface ItemProps {
  onClose: () => void;
  initialValue: DefaultItem | null;
  onSubmit: (data: ItemSchemaData) => void;
  entryName: string;
}

const ItemForm = ({
  onClose,
  initialValue,
  onSubmit,
  entryName,
}: ItemProps) => {
  const {
    formState: { isValid, errors },
    handleSubmit,
    setValue,
    register,
    trigger,
  } = useForm<ItemSchemaData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: initialValue ? initialValue.name : "",
      image: initialValue ? createEmptyImageFile() : undefined,
    },
  });
  const [fileName, setFileName] = useState<string | undefined>(
    initialValue?.imageName
  );

  const updateMode = initialValue !== null;

  const handleFileChange = async (file: File | null) => {
    setValue("image", file || undefined);
    setFileName(file?.name);
    if (file) {
      await trigger("image");
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
        label={`${entryName} Image`}
        accept="image/*"
        onChange={handleFileChange}
        error={errors.image?.message}
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

export default ItemForm;
