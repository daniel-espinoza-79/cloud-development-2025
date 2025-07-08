import type { Song } from "@/types/music.types";
import EditButtons from "../ui/edit-buttons";
import { useRef } from "react";
import AnalyticsService from "@/services/AnalyticService";

interface SongCardProps {
  song: Song;
  isEditable?: boolean;
  artistName: string;
  genreName: string;
  onStartDelete?: (id: string) => void;
  onStartEdit?: (id: string) => void;
}
const SongCard = ({
  song,
  isEditable,
  artistName,
  genreName,
  onStartDelete,
  onStartEdit,
}: SongCardProps) => {
  const { id: songId, name: songName } = song;
  const audioRef = useRef<HTMLAudioElement>(null);
  const startTime = useRef<number>(0);

  const handlePlay = () => {
    startTime.current = Date.now();
    AnalyticsService.logPlaySong(songId, songName, artistName, genreName);
  };

  const handlePause = () => {
    const duration = Math.floor((Date.now() - startTime.current) / 1000);
    AnalyticsService.logPauseSong(songId, songName, duration);
  };

  const handleEnded = () => {
    const totalDuration = audioRef.current?.duration || 0;
    AnalyticsService.logSongComplete(songId, songName, totalDuration);
  };

  const handleStartEdit = () => onStartEdit?.(song.id);
  const handleStartDelete = () => onStartDelete?.(song.id);

  return (
    <div className="bg-tertiary rounded-lg shadow-md p-4 mb-4">
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

      <audio
        controls
        ref={audioRef}
        className="w-full"
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
      >
        <source src={song.audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default SongCard;
