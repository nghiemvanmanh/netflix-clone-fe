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
