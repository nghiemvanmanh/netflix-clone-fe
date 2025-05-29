export interface Profile {
  id: number;
  name: string;
  avatarUrl: string | null;
  isKids: boolean;
}

export interface Actor {
  id: number;
  name: string;
  description: string;
  photoUrl?: string;
}

export interface Director {
  id: number;
  name: string;
  description: string;
  photoUrl?: string;
}

export interface Genre {
  id: number;
  name: string;
}
export interface MovieType {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
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
  id: number;
  email: string;
  isAdmin: boolean;
}

export interface MyList {
  id: number;
  userId: number;
  movieId: number;
}
