import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/home/home.component';
import { AboutComponent } from './features/public/about/about.component';
import { LoginComponent } from './features/public/auth/login/login.component';
import { RegisterComponent } from './features/public/auth/register/register.component';
import { NutritionComponent } from './features/public/nutrition/nutrition.component';
import { WorkoutsComponent } from './features/public/workouts/workouts.component';
import { ClubsComponent } from './features/public/clubs/clubs.component';
import { ProfilesComponent } from './features/public/profiles/profiles.component';

import { ClubLayoutComponent } from './shared/layouts/club-layout/club-layout.component';
import { DashboardComponent } from './features/club/pages/dashboard/dashboard.component';
import { CoachesComponent } from './features/club/pages/coaches/coaches.component';

import { MembersComponent } from './features/club/pages/members/members.component';
import { SubscriptionsComponent } from './features/club/pages/subscriptions/subscriptions.component';
import { CommunityComponent as ClubCommunityComponent } from './features/club/pages/community/community.component';

import { CoachLayoutComponent } from './shared/layouts/coach-layout/coach-layout.component';
import { CoachDashboardComponent } from './features/coach/pages/dashboard/dashboard.component';
import { ClientsComponent } from './features/coach/pages/clients/clients.component';
import { ProgramsComponent } from './features/coach/pages/programs/programs.component';
import { ScheduleComponent } from './features/coach/pages/schedule/schedule.component';
import { ChatComponent } from './features/coach/pages/chat/chat.component';
import { AiAssistantComponent } from './features/coach/pages/ai-assistant/ai-assistant.component';
import { CommunityComponent as CoachCommunityComponent } from './features/coach/pages/community/community.component';
import { ProfileComponent } from './features/coach/pages/profile/profile.component';

import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { DashboardComponent as AdminDashboardComponent } from './features/admin/pages/dashboard/dashboard.component';

export const routes: Routes = [

 
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'nutrition', component: NutritionComponent },
  { path: 'clubs', component: ClubsComponent },
  { path: 'workouts', component: WorkoutsComponent },
  
  { path: 'complete-profile', component: ProfilesComponent },
  { path: 'profiles', component: ProfilesComponent },

  
  {
    path: 'club',
    component: ClubLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'coaches', component: CoachesComponent },
      { path: 'members', component: MembersComponent },             
      { path: 'subscriptions', component: SubscriptionsComponent }, 
      { path: 'community', component: ClubCommunityComponent },     
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },


  {
    path: 'coach',
    component: CoachLayoutComponent,
    children: [
      { path: 'dashboard', component: CoachDashboardComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'programs', component: ProgramsComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'community', component: CoachCommunityComponent },
      { path: 'ai-assistant', component: AiAssistantComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  
  {
    path: 'admin', 
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];