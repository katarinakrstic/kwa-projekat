import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../services/user.service';
import { Reservation } from '../models/reservation.model';
import { ReservationStorageService } from '../services/reservationStorage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  title = '';
  date = '';
  time = '';
  selectedType: '2D' | '3D' | null = null;
  numberOfTickets: number = 1;

  get pricePerTicket() {
    return this.selectedType === '3D' ? 700 : 500;
  }

  get totalPrice() {
    return this.pricePerTicket * this.numberOfTickets;
  }

  constructor(
    private route: ActivatedRoute, 
    private reservationStorage: ReservationStorageService, 
    private router: Router
  ) {
    this.title = this.route.snapshot.paramMap.get('title') ?? '';
    this.date = this.route.snapshot.paramMap.get('date') ?? '';
    this.time = this.route.snapshot.paramMap.get('time') ?? '';
  }

  confirmReservation() {
  if(!this.selectedType) return;

  const activeUser = UserService.getActiveUser();
  if(!activeUser) {
    Swal.fire({
        icon: 'error',
        title: 'Neuspešna rezervacija karata',
        text: 'Morate biti ulogovani da biste rezervisali karte.',
        confirmButtonText: 'OK',
        background: '#2d292c',
        color: '#f5e0f7',
        confirmButtonColor: '#cd66d7',
        iconColor: '#cd66d7'
    });
    this.router.navigate(['/login']);
    return;
  }

  const reservation: Reservation = {
    userEmail: activeUser.email,
    movieTitle: this.title,
    date: this.date,
    time: this.time,
    type: this.selectedType,
    numberOfTickets: this.numberOfTickets,
    pricePerTicket: this.pricePerTicket,
    totalPrice: this.totalPrice,
    status: 'REZERVISANO'
  };

  this.reservationStorage.addReservation(reservation);

  Swal.fire({
        icon: 'success',
        title: 'Hvala na rezervaciji!',
        text: 'Uspešno ste rezervisali karte.',
        confirmButtonText: 'OK',
        background: '#2d292c',
        color: '#f5e0f7',
        confirmButtonColor: '#cd66d7',
        iconColor: '#cd66d7'
  });

  this.router.navigate(['/user']);
  }
}