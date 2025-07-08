export interface UserData {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface Identity {
  id: string;
  createdAt: Date;
}

export interface Genre extends Identity {
  name: string;
  imageName: string;
  imageUrl: string;
}

export interface Artist extends Identity {
  name: string;
  imageName: string;
  imageUrl: string;
  genreId: string;
}

export interface Song extends Identity {
  name: string;
  audioFimeName: string;
  audioUrl: string;
  artistId: string;
}
