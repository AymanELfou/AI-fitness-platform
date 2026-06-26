import { Routes } from '@angular/router';

// ==========================================
// PUBLIC & AUTH COMPONENTS
// ==========================================
import { HomeComponent } from './features/public/home/home.component';
import { AboutComponent } from './features/public/about/about.component';
import { LoginComponent } from './features/public/auth/login/login.component';
import { RegisterComponent } from './features/public/auth/register/register.component';
import { NutritionComponent } from './features/public/nutrition/nutrition.component';
import { WorkoutsComponent } from './features/public/workouts/workouts.component';
import { ClubsComponent } from './features/public/clubs/clubs.component';
import { ProfilesComponent } from './features/public/complete-profiles/profiles.component';

// ==========================================
// CLUB COMPONENTS & LAYOUT
// ==========================================
import { ClubLayoutComponent } from './shared/layouts/club-layout/club-layout.component';
import { DashboardComponent } from './features/club/pages/dashboard/dashboard.component';
import { CoachesComponent } from './features/club/pages/coaches/coaches.component';
import { MembersComponent } from './features/club/pages/members/members.component';
import { SubscriptionsComponent } from './features/club/pages/subscriptions/subscriptions.component';
import { CommunityComponent as ClubCommunityComponent } from './features/club/pages/community/community.component';

// ==========================================
// COACH COMPONENTS & LAYOUT
// ==========================================
import { CoachLayoutComponent } from './shared/layouts/coach-layout/coach-layout.component';
import { CoachDashboardComponent } from './features/coach/pages/dashboard/dashboard.component';
import { ClientsComponent } from './features/coach/pages/clients/clients.component';
import { ProgramsComponent } from './features/coach/pages/programs/programs.component';
import { ScheduleComponent } from './features/coach/pages/schedule/schedule.component';
import { ChatComponent } from './features/coach/pages/chat/chat.component';
import { AiAssistantComponent } from './features/coach/pages/ai-assistant/ai-assistant.component';
import { CommunityComponent as CoachCommunityComponent } from './features/coach/pages/community/community.component';
import { ProfileComponent } from './features/coach/pages/profile/profile.component';

// ==========================================
// ADMIN COMPONENTS & LAYOUT
// ==========================================
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { DashboardComponent as AdminDashboardComponent } from './features/admin/pages/dashboard/dashboard.component';
import { AdminUsersComponent } from './features/admin/pages/users/users.component';
import { AdminClubsComponent } from './features/admin/pages/clubs/clubs.component';
import { AdminCoachesComponent } from './features/admin/pages/coaches/coaches.component';
import { AdminSubscriptionsComponent } from './features/admin/pages/subscriptions/subscriptions.component';
import { AdminReportsComponent } from './features/admin/pages/reports/reports.component';
import { AdminSettingsComponent } from './features/admin/pages/settings/settings.component';

// ==========================================
// CLIENT COMPONENTS & LAYOUT
// ==========================================
import { ClientLayoutComponent } from './shared/layouts/client-layout/client-layout.component';
import { DashboardComponent as ClientDashboardComponent } from './features/client/pages/dashboard/dashboard.component';
import { ProgramsComponent as ClientProgramsComponent } from './features/client/pages/programs/programs.component';
import { WorkoutsComponent as ClientWorkoutsComponent } from './features/client/pages/workouts/workouts.component';
import { ProgressComponent as ClientProgressComponent } from './features/client/pages/progress/progress.component';
import { ClientCommunityComponent } from './features/client/pages/community/community.component';
import { ClientChatComponent } from './features/client/pages/chat/chat.component';

import { authGuard } from './core/guards/auth.guard';

// ==========================================
// ROUTES CONFIGURATION
// ==========================================
export const routes: Routes = [

  // Public routes
  { path: '', component: HomeComponent },
  { path: 'dashboard', redirectTo: '', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'nutrition', component: NutritionComponent },
  { path: 'clubs', component: ClubsComponent, canActivate: [authGuard] },
  { path: 'workouts', component: WorkoutsComponent, canActivate: [authGuard] },
  { path: 'complete-profile', component: ProfilesComponent },
  { path: 'profiles', component: ProfilesComponent },

  // Club Panel Routing
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

  // Coach Panel Routing
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

  // Admin Routing
  {
    path: 'admin', 
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard',      component: AdminDashboardComponent      },
      { path: 'users',         component: AdminUsersComponent         },
      { path: 'clubs',         component: AdminClubsComponent         },
      { path: 'coaches',       component: AdminCoachesComponent       },
      { path: 'subscriptions', component: AdminSubscriptionsComponent },
      { path: 'reports',       component: AdminReportsComponent       },
      { path: 'settings',      component: AdminSettingsComponent      },
      { path: '',              redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // User Client Routing
  {
    path: 'client', 
    component: ClientLayoutComponent,
    children: [
      { path: 'dashboard',  component: ClientDashboardComponent },
      { path: 'programs',   component: ClientProgramsComponent  },
      { path: 'workouts',   component: ClientWorkoutsComponent  },
      { path: 'progress',   component: ClientProgressComponent  },
      { path: 'community',  component: ClientCommunityComponent },
      { path: 'chat',       component: ClientChatComponent      },
      { path: '',           redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Global Fallbackgit 
  { path: '**', redirectTo: '' }
];