import ItemCard from "@/components/ui/ItemCard";
import GridContainer from "@/components/ui/GridContainer";
import { useNavigate } from "react-router";
import ActionDialog from "@/components/wrappers/ActionDialog";
import type { Genre } from "@/types/music.types";
import useData from "@/hooks/useData";
import AlertDialog from "@/components/ui/AlertDialog";
import { genreService } from "@/services/GenreDataService";
import ItemForm from "@/components/forms/ItemForm";
import { useAuth } from "@/hooks/useAuth";

const GenrePage = () => {
  const navigate = useNavigate();

  const {
    authState: { user },
  } = useAuth();
  const {
    data,
    isOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    handleIsOpenChange,
    handleCancelForm,
    handleSubmit,
    defaultData,
    handleStartDelete,
    handleStartEdit,
    handleDelete,
  } = useData(genreService, [], "Genre");

  const handleGenreSelect = (genre: Genre) => {
    navigate(`/genres/${genre.id}`, { state: { genre } });
  };

  return (
    <>
      <div className={"text-center my-12 animate-header-fade-in"}>
        <h1 className="text-5xl font-bold text-white mb-4">
          Explore
          <span className="primary-text-gradient"> Genres</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Discover your next favorite sound across diverse musical landscapes
        </p>
        <div
          className={
            "w-24 h-1 text-line-gradient mx-auto mt-6 rounded-full animate-line-scale"
          }
        />
      </div>
      <div className="flex justify-between items-center ">
        <h2 className="txt-h2">All Genres</h2>
        <ActionDialog
          isVisible={user?.isAdmin ?? false}
          isOpen={isOpen}
          setIsOpen={handleIsOpenChange}
        >
          <ItemForm
            onClose={handleCancelForm}
            onSubmit={handleSubmit}
            initialValue={defaultData}
            entryName="Genre"
          />
        </ActionDialog>
      </div>
      <GridContainer>
        {data.map((genre) => (
          <ItemCard
            key={genre.id}
            item={genre}
            isEditable={user?.isAdmin ?? false}
            onItemSelect={handleGenreSelect}
            onStartDelete={handleStartDelete}
            onStartEdit={handleStartEdit}
          />
        ))}
      </GridContainer>

      <AlertDialog
        isOpen={isDeleteOpen}
        itemName={defaultData?.name || ""}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default GenrePage;
