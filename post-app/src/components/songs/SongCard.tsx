import type { Song } from "@/types/music.types";
import EditButtons from "../ui/edit-buttons";

interface SongCardProps {
  song: Song;
  isEditable?: boolean;
  onStartDelete?: (id: string) => void;
  onStartEdit?: (id: string) => void;
}
const SongCard = ({
  song,
  isEditable,
  onStartDelete,
  onStartEdit,
}: SongCardProps) => {
  const handleStartEdit = () => onStartEdit?.(song.id);
  const handleStartDelete = () => onStartDelete?.(song.id);

  return (
    <div className="bg-tertiary rounded-lg shadow-md p-4 mb-4">
{/*    TODO : REMOVE THIS   <img
        src={song.audioImageUrl}
        alt={song.name}
        className="w-full h-32 object-cover rounded-md mb-1"
      /> */}
      <div
        className={` flex ${isEditable ? "justify-between" : "justify-center"}`}
      >
        <h3
          className={`text-lg font-semibold ${
            isEditable && "hover:underline cursor-pointer"
          }`}
        >
          {song.name}
        </h3>
        {isEditable && (
          <EditButtons onEdit={handleStartEdit} onDelete={handleStartDelete} />
        )}
      </div>

      <audio controls className="w-full">
        <source src={song.audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default SongCard;
