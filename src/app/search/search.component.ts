import { Component } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MovieModel } from '../models/movie.model';
import { UtilsService } from '../services/utils.service';
import { MovieService } from '../services/movie.service';
import { Projection } from '../models/projection.model';
import { RouterLink } from '@angular/router';
import { ReservationStorageService } from '../services/reservationStorage.service';

@Component({
  selector: 'app-search',
  imports: [
    LoadingComponent, 
    MatCardModule, 
    NgIf, 
    NgFor,
    MatFormFieldModule, 
    FormsModule, 
    MatButtonModule, 
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  allData: MovieModel[] | null = null;
  dataSource: MovieModel[] | null = null;
  titleList: string[] = [];
  selectedTitle: string | null = null;
  movieGenresList: any[] = [];
  selectedGenre: string | null = null;
  allProjections: Projection[] = [];
  filteredProjections: Projection[] = [];
  projectionDateList: string[] = [
    '07.07.2025', 
    '08.07.2025', 
    '09.07.2025', 
    '10.07.2025', 
    '11.07.2025', 
    '12.07.2025', 
    '13.07.2025'
  ];
  selectedDate: string | null = null;
  projectionTimeList: string[] = [
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30'
  ];

  public constructor(
    public utils: UtilsService, 
    private reservationStorage: ReservationStorageService
  ) {
    MovieService.getMovies()
      .then(rsp => {
        this.allData = rsp.data;
        this.dataSource = rsp.data;
        this.generateSearchCriteria(rsp.data);

        this.allProjections = [];

        for(const date of this.projectionDateList) {
          for(const movie of rsp.data) {
            for(const time of this.getRandomTimes(this.randomTimesCount())) {
              this.allProjections.push({
                movie,
                date,
                time
              });
            }
          }
        }

        this.filteredProjections = this.allProjections;
      });
  }

  private randomTimesCount(): number {
    return Math.min(Math.floor(Math.random() * 2) + 2, this.projectionTimeList.length);
  }

  private getRandomTimes(n: number): string[] {
    const shuffled = [...this.projectionTimeList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n).sort();
  }

  public generateSearchCriteria(source: MovieModel[]) {
    this.titleList = source.map(obj => obj.title)
      .filter((title: string, i: number, ar: any[]) => ar.indexOf(title) === i)
      .slice(0, 15);
    this.movieGenresList = source
      .flatMap(obj => obj.movieGenres.map(genre => genre.genre.name))
      .filter((genre, i, ar) => ar.indexOf(genre) === i);
  }

  public doReset() {
    this.filteredProjections = this.allProjections;
    this.dataSource = this.allData;
    this.selectedTitle = null;
    this.selectedGenre = null;
    this.selectedDate = null;
    this.generateSearchCriteria(this.allData!);
    this.doProjectionFilter();
  }

  public doFilterChain() {
    if(this.allData == null) return;

    this.dataSource = this.allData!
      .filter(obj => {
        if(this.selectedTitle == null) return true;
        return obj.title === this.selectedTitle;
      })
      .filter(obj => {
        if(this.selectedGenre == null) return true;
        return obj.movieGenres.some(genre => genre.genre.name === this.selectedGenre);
      });

    this.generateSearchCriteria(this.dataSource);
  }

  public doProjectionFilter() {
    this.filteredProjections = this.allProjections
      .filter(p => {
        const titleMatch = this.selectedTitle == null || p.movie.title === this.selectedTitle;
        const genreMatch = this.selectedGenre == null || p.movie.movieGenres.some(g => g.genre.name === this.selectedGenre);
        const dateMatch = this.selectedDate == null || p.date === this.selectedDate;
        return titleMatch && genreMatch && dateMatch;
      });

    this.filteredProjections.sort((a, b) => a.time.localeCompare(b.time));
  }

  public onFilterChange() {
    this.doFilterChain();
    this.doProjectionFilter();
  }

  public getGenreNames(projection: Projection): string {
    return projection.movie.movieGenres
      .map(g => g.genre.name)
      .join(', ');
  }

  getMovieRatingSummary(title: string): {likes: number, dislikes: number } {
    return this.reservationStorage.getRatingsByMovieTitle(title);
  }
}