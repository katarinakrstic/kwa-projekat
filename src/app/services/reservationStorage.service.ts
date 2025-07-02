import { Injectable } from '@angular/core';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationStorageService {
  private storageKey = 'userReservations';

  getAllReservations(): Reservation[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addReservation(reservation: Reservation): void {
    const reservations = this.getAllReservations();
    reservations.push(reservation);
    localStorage.setItem(this.storageKey, JSON.stringify(reservations));
  }

  updateReservation(updated: Reservation) {
    const reservations = this.getAllReservations();
    const index = reservations.findIndex(r =>
      r.userEmail === updated.userEmail &&
      r.movieTitle === updated.movieTitle &&
      r.date === updated.date &&
      r.time === updated.time
    );

    if(index !== -1) {
      reservations[index] = { ...updated };
      localStorage.setItem(this.storageKey, JSON.stringify(reservations));
    }
  }

  deleteReservation(reservationToDelete: Reservation) {
    const reservations = this.getAllReservations();
    const updated = reservations.filter(r =>
      !(
        r.userEmail === reservationToDelete.userEmail &&
        r.movieTitle === reservationToDelete.movieTitle &&
        r.date === reservationToDelete.date &&
        r.time === reservationToDelete.time
      )
    );
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  getRatingsByMovieTitle(title: string): {likes: number; dislikes: number} {
    const reservations = this.getAllReservations();

    const relevant = reservations.filter(r =>
      r.movieTitle === title &&
      r.status === 'GLEDANO' &&
      r.rating
    );

    const likes = relevant.filter(r => r.rating === 'SVIĐA MI SE').length;
    const dislikes = relevant.filter(r => r.rating === 'NE SVIĐA MI SE').length;

    return {likes, dislikes};
  }
}