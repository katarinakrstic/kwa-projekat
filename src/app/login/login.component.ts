import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule, 
    MatFormFieldModule, 
    FormsModule, 
    MatInputModule, 
    MatButtonModule, 
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public email: string = '';
  public password: string = '';

  constructor(private router: Router) {
    if(UserService.getActiveUser()) {
      router.navigate(['/user']);
      return;
    }
  }

  public doLogin() {
    if(UserService.login(this.email, this.password)) {
      this.router.navigate(['/user']);
      return;
    }

    Swal.fire({
      icon: 'error',
      title: 'Neuspešna prijava',
      text: 'Pogrešna email adresa ili lozinka.',
      confirmButtonText: 'OK',
      background: '#2d292c',
      color: '#f5e0f7',
      confirmButtonColor: '#cd66d7',
      iconColor: '#cd66d7'
    });
  }
}