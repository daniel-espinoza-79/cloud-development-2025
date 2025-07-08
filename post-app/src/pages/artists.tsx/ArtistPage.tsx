import ItemForm from "@/components/forms/ItemForm";
import AlertDialog from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import ItemCard from "@/components/ui/ItemCard";
import ActionDialog from "@/components/wrappers/ActionDialog";
import { useAuth } from "@/hooks/useAuth";
import useData from "@/hooks/useData";
import type { ItemSchemaData } from "@/schemas/genre.schema";
import ArtistService from "@/services/ArtisDataService";
import type { Artist } from "@/types/music.types";
import { MoveLeft } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router";

const ArtistPage = () => {
  const navigate = useNavigate();
  const {
    authState: { user },
  } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const genre = location.state?.genre;

  if (!id) {
    navigate("/");
  }

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
  } = useData<Artist, ItemSchemaData>(new ArtistService(id!), [], "Artist");

  const handleGoBack = () => {
    window.history.back();
  };

  const handleArtistSelect = (artist: Artist) => {
    navigate(`/genres/${id}/artists/${artist.id}`, { state: { artist } });
  };

  return (
    <>
      <div>
        <Button variant="ghost" onClick={handleGoBack}>
          <MoveLeft className="mr-2 h-4 w-4" /> Go to Genres
        </Button>
        <div className="flex justify-between items-center">
          <h2 className="txt-h2">{genre?.name} Artists</h2>
          <ActionDialog
            isVisible={user?.isAdmin ?? false}
            isOpen={isOpen}
            setIsOpen={handleIsOpenChange}
          >
            <ItemForm
              onClose={handleCancelForm}
              onSubmit={handleSubmit}
              initialValue={defaultData}
              entryName="Artist"
            />
          </ActionDialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((data) => (
            <ItemCard
              key={data.id}
              item={data}
              isEditable={user?.isAdmin ?? false}
              onItemSelect={handleArtistSelect}
              onStartEdit={handleStartEdit}
              onStartDelete={handleStartDelete}
            />
          ))}
        </div>
      </div>
      <AlertDialog
        isOpen={isDeleteOpen}
        itemName={defaultData?.name || ""}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default ArtistPage;
