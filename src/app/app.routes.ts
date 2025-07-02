import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserComponent } from './user/user.component';
import { SearchComponent } from './search/search.component';
import { ReservationComponent } from './reservation/reservation.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'details/:id', component: DetailsComponent },
    { path: 'search', component: SearchComponent },
    { path: 'reservation/:title/:date/:time', component: ReservationComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'user', component: UserComponent },
    { path: '**', redirectTo: '' }
];
