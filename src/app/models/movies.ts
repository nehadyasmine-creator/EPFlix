export interface Movie {
  id?: number;
  title: string;
  releaseDate: Date;
  director: string;
  rate?: number;
  synopsis: string;
  image?: string;
}
