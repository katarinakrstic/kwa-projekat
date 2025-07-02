import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MovieModel } from '../models/movie.model';
import { UtilsService } from '../services/utils.service';
import { MovieService } from '../services/movie.service';
import { AxiosError } from 'axios';
import { LoadingComponent } from '../loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ReservationStorageService } from '../services/reservationStorage.service';

@Component({
  selector: 'app-home',
  imports: [NgIf, MatCardModule, NgFor, LoadingComponent, MatButtonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public movies: MovieModel[] | null = null;
  public error: string | null = null;

  constructor(
    public utils: UtilsService, 
    private reservationStorage: ReservationStorageService
  ) {
    MovieService.getMovies()
      .then(rsp => {
        this.movies = rsp.data.slice(0, 15);
      })
      .catch((e: AxiosError) => this.error = `${e.code}: ${e.message}`);
  }

  getMovieRatingSummary(title: string): {likes: number, dislikes: number} {
    return this.reservationStorage.getRatingsByMovieTitle(title);
  }
}