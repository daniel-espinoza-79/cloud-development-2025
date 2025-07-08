import SongCard from "@/components/songs/SongCard";
import SongForm from "@/components/songs/SongForm";
import AlertDialog from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import GridContainer from "@/components/ui/GridContainer";
import ActionDialog from "@/components/wrappers/ActionDialog";
import useData from "@/hooks/useData";
import type { SongFormData } from "@/schemas/song.schema";
import SongService from "@/services/SongDataService";
import type { Song } from "@/types/music.types";
import { MoveLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";

const SongsPage = () => {
  const { genreId, artistId } = useParams();
  const location = useLocation();
  const artist = location.state?.artist;
  const navigate = useNavigate();

  if (!genreId || !artistId) {
    navigate(`/`);
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
  } = useData<Song, SongFormData>(new SongService(artistId!), [], "Artist");

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <>
      <div>
        <Button variant="ghost" onClick={handleGoBack}>
          <MoveLeft className="mr-2 h-4 w-4" /> Go to Artists
        </Button>
        <div className="flex justify-between items-center">
          <h2 className="txt-h2">
            {`${artist ? artist?.name + "'s" : ""}`} Songs
          </h2>

          <ActionDialog
            isVisible
            isOpen={isOpen}
            setIsOpen={handleIsOpenChange}
          >
            <button>action button</button>
          <SongForm
            onClose={handleCancelForm}
            onSubmit={handleSubmit}
            initialValue={defaultData}
            entryName="Artist"
          /> 
          </ActionDialog>
        </div>
        <GridContainer>
          {data.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isEditable={true}
              onStartDelete={handleStartDelete}
              onStartEdit={handleStartEdit}
            />
          ))}
        </GridContainer>
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

export default SongsPage;
