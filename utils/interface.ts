import { typeNotification } from "./enum";

export interface Profile {
  id: string;
  name: string;
  avatarUrl: string | null;
  isKids: boolean;
}

export interface Actor {
  id: string;
  name: string;
  description: string;
  photoUrl?: string;
}

export interface Director {
  id: string;
  name: string;
  description: string;
  photoUrl?: string;
}

export interface Genre {
  id: string;
  name: string;
}
export interface MovieType {
  id: string;
  name: string;
}

export interface Movie {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl?: string;
  duration: string;
  releaseDate: Date;
  genres: Genre[];
  movieTypes: MovieType[];
  actors: Actor[];
  directors: Director[];
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface MyList {
  id: string;
  userid: string;
  movieid: string;
}
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: typeNotification;
  isRead: boolean;
  createdAt: Date;
  movieId?: string;
  movieTitle?: string;
  movieImage?: string;
}
