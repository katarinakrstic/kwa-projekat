import { MovieModel } from "./movie.model";

export interface Projection {
    movie: MovieModel,
    date: string,
    time: string 
}