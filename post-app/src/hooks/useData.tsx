/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Identity } from "@/types/music.types";
import { showAsyncToast, showToast } from "@/utils/classNames.utils";
import { useEffect, useState } from "react";

interface IDataService<TEntity extends Identity, TCreateData> {
  deleteData: (id: string) => Promise<void>;
  updateData: (id: string, data: TCreateData) => Promise<TEntity>;
  createData: (data: TCreateData) => Promise<TEntity | null>;
  fetchData: () => Promise<TEntity[]>;
}

const useData = <TEntity extends Identity, TCreateData = Partial<TEntity>>(
  dataService?: IDataService<TEntity, TCreateData>,
  defaultDataList?: TEntity[],
  entryName: string = "Entry"
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TEntity[]>(defaultDataList || []);
  const [defaultData, setDefaultData] = useState<TEntity | null>(null);

  const getElementById = (id: string): TEntity | undefined => {
    return data.find((item) => item.id === id);
  };

  const handleIsOpenChange = (isOpenDialog: boolean) => {
    if (!isOpenDialog) {
      setDefaultData(null);
    }
    setIsOpen(isOpenDialog);
  };

  const handleCancelForm = () => {
    handleIsOpenChange(false);
  };

  const resetForm = () => {
    handleIsOpenChange(false);
    setDefaultData(null);
  };

  const handleSubmit = async (formData: TCreateData): Promise<void> => {
    if (!dataService) {
      showToast("error", "No data service provided");
      return;
    }
    try {
      if (defaultData) {
        showAsyncToast(
          dataService.updateData(defaultData.id, formData),
          (updatedData: TEntity | null) => {
            if (!updatedData) {
              return {
                message: `error`,
                description: `Error updating ${entryName.toLowerCase()}`,
              };
            }
            setData((prev) =>
              prev.map((item) =>
                item.id === updatedData.id ? updatedData : item
              )
            );
            resetForm();
            return {
              message: `success`,
              description: `${entryName} updated successfully`,
            };
          },
          (e: any) => {
            console.error(`Error updating ${entryName.toLowerCase()}:`, e);
            resetForm();
            return {
              message: `error`,
              description: `Error updating ${entryName.toLowerCase()}`,
            };
          },
          `Updating ${entryName.toLowerCase()} ...`
        );
      } else {
        showAsyncToast(
          dataService.createData(formData),
          (createdData: TEntity | null) => {
            if (!createdData) {
              return {
                message: `error`,
                description: `Error creating ${entryName.toLowerCase()}`,
              };
            }
            setData((prev) => [...prev, createdData]);
            resetForm();
            return {
              message: `success`,
              description: `${entryName} created successfully`,
            };
          },
          (e: any) => {
            console.error(`Error creating ${entryName.toLowerCase()}:`, e);
            resetForm();
            return {
              message: `error`,
              description: `Error creating ${entryName.toLowerCase()}`,
            };
          },
          `Creating ${entryName.toLowerCase()} ...`
        );
      }
    } catch (error) {
      showToast(
        "error",
        "Operation failed",
        "Operation could not be completed"
      );
      console.error(`Error with ${entryName.toLowerCase()}:`, error);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!dataService || !defaultData) {
      showToast("error", `Error deleting ${entryName.toLowerCase()}`);
      return;
    }
    showAsyncToast(
      dataService.deleteData(defaultData.id),
      () => {
        setData((prev) => prev.filter((item) => item.id !== defaultData.id));
        setIsDeleteOpen(false);
        setDefaultData(null);
        return {
          message: `success`,
          description: `${entryName} deleted successfully`,
        };
      },
      (e: any) => {
        console.error(`Error deleting ${entryName.toLowerCase()}:`, e);
        return {
          message: `error`,
          description: `Error deleting ${entryName.toLowerCase()}`,
        };
      },
      `Deleting ${entryName.toLowerCase()} ...`
    );
  };

  const handleStartDelete = (id: string) => {
    const entity = getElementById(id);
    if (entity) {
      setDefaultData(entity);
      setIsDeleteOpen(true);
    }
  };

  const handleStartEdit = (id: string) => {
    const entity = getElementById(id);
    if (entity) {
      setDefaultData(entity);
      handleIsOpenChange(true);
    }
  };

  const refreshData = async (): Promise<void> => {
    if (!dataService) return;

    try {
      setIsLoading(true);
      const fetchedData = await dataService.fetchData();
      setData(fetchedData);
    } catch (error) {
      showToast("error", "Error fetching data");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataService) {
      refreshData();
    }
  }, []);

  return {
    // States
    isOpen,
    isDeleteOpen,
    isLoading,
    data,
    defaultData,

    // Actions
    setData,
    handleIsOpenChange,
    handleCancelForm,
    handleSubmit,
    handleStartDelete,
    handleStartEdit,
    handleDelete,
    setIsDeleteOpen,

    // Utilities
    getElementById,
    refreshData,
  };
};

export default useData;
export type { IDataService };
