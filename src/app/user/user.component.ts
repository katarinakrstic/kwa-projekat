import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Reservation } from '../models/reservation.model';
import { ReservationStorageService } from '../services/reservationStorage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  imports: [
    MatCardModule, 
    NgIf, 
    NgFor,
    MatAccordion, 
    MatExpansionModule, 
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  public user: UserModel | null = null;
  public userCopy: UserModel | null = null;
  public oldPasswordValue = '';
  public newPasswordValue = '';
  public repeatPasswordValue = '';
  reservations: Reservation[] = [];

  constructor(private router: Router, private reservationStorage: ReservationStorageService) {
    if(!UserService.getActiveUser()) {
      router.navigate(['/home']);
      return;
    }

    this.user = UserService.getActiveUser();
    this.userCopy = UserService.getActiveUser();

    this.loadReservations();
  }

  public doChangePassword() {
    if(this.oldPasswordValue == '' || this.newPasswordValue == null) {
      Swal.fire({
            icon: 'error',
            title: 'Neuspešna promena lozinke',
            text: 'Polje za lozinku ne sme biti prazno.',
            confirmButtonText: 'OK',
            background: '#2d292c',
            color: '#f5e0f7',
            confirmButtonColor: '#cd66d7',
            iconColor: '#cd66d7'
      });
      return;
    }

    if(this.newPasswordValue !== this.repeatPasswordValue) {
      Swal.fire({
            icon: 'error',
            title: 'Neuspešna promena lozinke',
            text: 'Lozinke nisu iste.',
            confirmButtonText: 'OK',
            background: '#2d292c',
            color: '#f5e0f7',
            confirmButtonColor: '#cd66d7',
            iconColor: '#cd66d7'
      });
      return;
    }

    if(this.oldPasswordValue !== this.user?.password) {
      Swal.fire({
            icon: 'error',
            title: 'Neuspešna promena lozinke',
            text: 'Stara lozinka nije tačna.',
            confirmButtonText: 'OK',
            background: '#2d292c',
            color: '#f5e0f7',
            confirmButtonColor: '#cd66d7',
            iconColor: '#cd66d7'
      });
      return;
    }

      UserService.changePassword(this.newPasswordValue) ?
        Swal.fire({
            icon: 'success',
            title: 'Lozinka je uspešno promenjena!',
            confirmButtonText: 'OK',
            background: '#2d292c',
            color: '#f5e0f7',
            confirmButtonColor: '#cd66d7',
            iconColor: '#cd66d7'
        })
      : 
      Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Neuspešna promena lozinke. Pokušajte ponovo.',
            confirmButtonText: 'OK',
            background: '#2d292c',
            color: '#f5e0f7',
            confirmButtonColor: '#cd66d7',
            iconColor: '#cd66d7'
      });

    this.oldPasswordValue = '';
    this.newPasswordValue = '';
    this.repeatPasswordValue = '';
  }

  public doUpdateUser() {
    if(this.userCopy == null) {
      Swal.fire({
            icon: 'error',
            title: 'Korisnik nije pronađen!',
            confirmButtonText: 'OK',
            background: '#2d292c',
            color: '#f5e0f7',
            confirmButtonColor: '#cd66d7',
            iconColor: '#cd66d7'
      });
      return;
    }

    UserService.updateUser(this.userCopy);
    this.user = UserService.getActiveUser();
    Swal.fire({
            icon: 'success',
            title: 'Uspešno ste ažurirali svoj profil!',
            confirmButtonText: 'OK',
            background: '#2d292c',
            color: '#f5e0f7',
            confirmButtonColor: '#cd66d7',
            iconColor: '#cd66d7'
    });
  }

  loadReservations() {
    const allReservations = this.reservationStorage.getAllReservations();
    const userEmail = this.user?.email;

    this.reservations = [...allReservations.filter(r => r.userEmail === userEmail)];
  }

  changeStatus(reservation: Reservation, newStatus: 'GLEDANO' | 'OTKAZANO') {
    reservation.status = newStatus;
    this.reservationStorage.updateReservation(reservation);
    this.loadReservations();
  }

  deleteReservation(reservation: Reservation) {
    this.reservationStorage.deleteReservation(reservation);
    this.loadReservations();
  }

  rateReservation(reservation: Reservation, rating: 'SVIĐA MI SE' | 'NE SVIĐA MI SE') {
    reservation.rating = rating;
    this.reservationStorage.updateReservation(reservation);
    this.loadReservations();
  }
}