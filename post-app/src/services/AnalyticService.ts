import { logEvent } from "firebase/analytics";
import { analytics } from "@/config/firebase.config";

class AnalyticsService {
  static logLogin(method: string = "email") {
    logEvent(analytics, "login", {
      method: method,
    });
  }

  static logSignUp(method: string = "email") {
    logEvent(analytics, "sign_up", {
      method: method,
    });
  }

  static logLogout() {
    logEvent(analytics, "logout");
  }

  static logSelectGenre(genreId: string, genreName: string) {
    logEvent(analytics, "select_item", {
      item_list_id: "genres",
      item_list_name: "Music Genres",
      items: [
        {
          item_id: genreId,
          item_name: genreName,
          item_category: "genre",
        },
      ],
    });
  }

  static logSelectArtist(artistId: string, artistName: string, genre: string) {
    logEvent(analytics, "select_item", {
      item_list_id: "artists",
      item_list_name: "Artists",
      items: [
        {
          item_id: artistId,
          item_name: artistName,
          item_category: "artist",
          item_category2: genre,
        },
      ],
    });
  }

  static logPlaySong(
    songId: string,
    songName: string,
    artistName: string,
    genre: string
  ) {
    logEvent(analytics, "play_song", {
      song_id: songId,
      song_name: songName,
      artist_name: artistName,
      genre: genre,
      content_type: "audio",
    });
  }

  static logPauseSong(songId: string, songName: string, duration: number) {
    logEvent(analytics, "pause_song", {
      song_id: songId,
      song_name: songName,
      duration_seconds: duration,
    });
  }

  static logSongComplete(
    songId: string,
    songName: string,
    totalDuration: number
  ) {
    logEvent(analytics, "song_complete", {
      song_id: songId,
      song_name: songName,
      total_duration: totalDuration,
    });
  }
}

export default AnalyticsService;
