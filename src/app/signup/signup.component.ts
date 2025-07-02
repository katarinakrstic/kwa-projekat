import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  imports: [
    MatCardModule, 
    MatFormFieldModule, 
    FormsModule, 
    MatInputModule, 
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  public email = '';
  public password = '';
  public repeatPassword = '';
  public firstName = '';
  public lastName = '';
  public phone = '';
  public address = '';

  public constructor(private router: Router) {

  }

  public doSignup() {
    if(this.email == '' || this.password == '') {
      Swal.fire({
            icon: 'error',
            title: 'Neuspešna registracija',
            text: 'Polja za email adresu i lozinku su obavezna.',
            confirmButtonText: 'OK',
            background: '#2d292c',
            color: '#f5e0f7',
            confirmButtonColor: '#cd66d7',
            iconColor: '#cd66d7'
      });
      return;
    }

    if(this.password !== this.repeatPassword) {
      Swal.fire({
            icon: 'error',
            title: 'Neuspešna registracija',
            text: 'Lozinke nisu iste.',
            confirmButtonText: 'OK',
            background: '#2d292c',
            color: '#f5e0f7',
            confirmButtonColor: '#cd66d7',
            iconColor: '#cd66d7'
      });
      return;
    }

    const result = UserService.createUser({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      address: this.address
    });

    result ? this.router.navigate(['/login']) : Swal.fire({
      icon: 'error',
      title: 'Neuspešna registracija',
      text: 'Email adresa već postoji.',
      confirmButtonText: 'OK',
      background: '#2d292c',
      color: '#f5e0f7',
      confirmButtonColor: '#cd66d7',
      iconColor: '#cd66d7'
    });
  }
}