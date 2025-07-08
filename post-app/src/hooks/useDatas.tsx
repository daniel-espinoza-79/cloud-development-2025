/* import type { Genre } from "@/types/music.types";
import { useEffect, useState } from "react";
import type { GenreSchemaData } from "@/schemas/genre.schema";
import { toast } from "react-hot-toast";

interface IDataService {
  deleteData: (id: string) => Promise<void>;
  updateData: (id: string, data: GenreSchemaData) => Promise<Genre>;
  createData: (data: GenreSchemaData) => Promise<Genre | null>;
  fetchData: () => Promise<Genre[]>;
}

const useData = (
  dataService?: IDataService,
  defaultDataList?: Genre[],
  entryName: string | null = "Entry"
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Genre[]>(defaultDataList || []);
  const [defaultData, setDefaultData] = useState<Genre | null>(null);

  const handleIsOpenChange = (isOpenDialog: boolean) => {
    if (!isOpenDialog) {
      setDefaultData(null);
    }
    setIsOpen(isOpenDialog);
  };

  const handleCancelForm = () => {
    handleIsOpenChange(false);
  };

  const handleSubmit = async (genre: GenreSchemaData) => {
    try {
      if (defaultData) {
        const updatedData = await dataService?.updateData(
          defaultData.id,
          genre
        );
        if (updatedData) {
          setData(
            data.map((item) =>
              item.id === updatedData.id ? updatedData : item
            )
          );
          toast.success(`${entryName} updated successfully`);
        } else {
          toast.error("Error updating entry");
        }
      } else {
        const newData = await dataService?.createData(genre);
        if (newData) {
          setData([...data, newData]);
          toast.success(`${entryName} created successfully`);
        } else {
          toast.error("Error creating entry");
        }
      }
    } catch (error) {
      toast.error("Operation failed", {
        description: "Operation could not be completed",
      });
      console.error("Error creating genre:", error);
    } finally {
      handleIsOpenChange(false);
      setDefaultData(null);
    }
  };

  const handleDelete = async () => {
    if (defaultData) {
      await dataService?.deleteData(defaultData.id);
      setData(data.filter((item) => item.id !== defaultData.id));
      setIsDeleteOpen(false);
      toast.success(`${entryName} deleted successfully`);
    } else {
      toast.error("Error deleting genre");
    }
  };

  const handleStartDelete = (id: string) => {
    setDefaultData(getElementById(id)!);
    setIsDeleteOpen(true);
  };

  const getElementById = (id: string) => {
    return data.find((item) => item.id === id);
  };

  const handleStartEdit = (id: string) => {
    setDefaultData(getElementById(id)!);
    handleIsOpenChange(true);
  };

  useEffect(() => {
    if (dataService) {
      setIsLoading(true);
      dataService
        .fetchData()
        .then((fetchedData) => {
          setData(fetchedData);
        })
        .catch((error) => {
          toast.error("Error fetching data");
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return {
    isOpen,
    defaultData,
    data,
    setData,
    handleIsOpenChange,
    handleCancelForm,
    handleSubmit,
    handleStartDelete,
    handleStartEdit,
    isDeleteOpen,
    setIsDeleteOpen,
    isLoading,
    handleDelete,
  };
};

export default useData;
 */