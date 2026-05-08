import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/home/home.component';
import { AboutComponent } from './features/public/about/about.component';
import { LoginComponent } from './features/public/auth/login/login.component';
import { NutritionComponent } from './features/public/nutrition/nutrition.component';
import { ClubsComponent } from './features/public/clubs/clubs.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'nutrition', component: NutritionComponent },
  { path: 'clubs', component: ClubsComponent },

  { path: '**', redirectTo: '' }
]; 