import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AxiosError } from 'axios';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MovieModel } from '../models/movie.model';
import { UtilsService } from '../services/utils.service';
import { MovieService } from '../services/movie.service';
import { ReservationStorageService } from '../services/reservationStorage.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-details',
  imports: [NgIf, MatCardModule, RouterLink, MatButtonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  public movie: MovieModel | null = null;
  public error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public utils: UtilsService,
    private reservationStorage: ReservationStorageService 
  ) {}

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    MovieService.getMovieById(movieId)
      .then(response => {
        this.movie = response.data;
      })
      .catch((e: AxiosError) => {
        this.error = `${e.code}: ${e.message}`;
      });
  }

  getMovieRatingSummary(title: string): {likes: number, dislikes: number} {
    return this.reservationStorage.getRatingsByMovieTitle(title);
  }

  public getGenreNames(): string {
    if(!this.movie) return '';
    return this.movie.movieGenres.map(g => g.genre.name).join(', ');
  }

  public getActorNames(): string {
    if(!this.movie) return '';
    return this.movie.movieActors.map(a => a.actor.name).join(', ');
  }
}