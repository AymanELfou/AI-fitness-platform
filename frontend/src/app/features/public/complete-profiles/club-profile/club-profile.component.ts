import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { club } from '../../../../core/models/club.model';
import { ClubService } from '../../../../core/services/club.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CommunityService } from '../../../../core/services/community.service';
import { AbonnementService } from '../../../../core/services/abonnement.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-club-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './club-profile.component.html',
  styleUrls: ['../shared-forms.scss', './club-profile.component.scss']
})
export class ClubProfileComponent implements OnInit {
  clubForm!: FormGroup;
  showSuccessAlert = false;

  constructor(
    private fb: FormBuilder,
    private clubService: ClubService,
    private authService: AuthService,
    private communityService: CommunityService,
    private abonnementService: AbonnementService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.clubForm = this.fb.group({
      clubName: ['', Validators.required],
      localisation: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      subscriptionPlan: ['', Validators.required],
      // Community
      communityName: ['', Validators.required],
      communityDescription: ['', Validators.required],
      // Basic Abonnement
      basicPrice: ['', Validators.required],
      basicDuration: [30, Validators.required],
      basicDescription: ['', Validators.required],
      // Premium Abonnement
      premiumPrice: ['', Validators.required],
      premiumDuration: [30, Validators.required],
      premiumDescription: ['', Validators.required],
      // Enterprise Abonnement
      enterprisePrice: ['', Validators.required],
      enterpriseDuration: [30, Validators.required],
      enterpriseDescription: ['', Validators.required]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.clubForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submit() {
    if (this.clubForm.valid) {
      const formValue = this.clubForm.value;   
      const clubData: Partial<club> = {
        clubName: formValue.clubName,
        localisation: formValue.localisation,
        capacity: formValue.capacity,
        contactEmail: formValue.contactEmail,
        phone: formValue.phone,
        subscriptionPlan: formValue.subscriptionPlan
      };
      
      const user = this.authService.currentUser();

      if (!user || !user.id) {
        alert('User not authenticated properly.');
        return;
      }

      this.clubService.createClub(user.id, clubData).subscribe({
        next: (createdClub: any) => {
          console.log('Club created successfully:', createdClub);
          const clubId = createdClub.id;

          const createCommunity$ = this.communityService.create({
            name: formValue.communityName,
            description: formValue.communityDescription,
            clubId: clubId
          });

          const createBasic$ = this.abonnementService.create({
            type: 'BASIC',
            price: formValue.basicPrice,
            duration: formValue.basicDuration,
            description: formValue.basicDescription,
            clubId: clubId
          });

          const createPremium$ = this.abonnementService.create({
            type: 'PREMIUM',
            price: formValue.premiumPrice,
            duration: formValue.premiumDuration,
            description: formValue.premiumDescription,
            clubId: clubId
          });

          const createEnterprise$ = this.abonnementService.create({
            type: 'ENTERPRISE',
            price: formValue.enterprisePrice,
            duration: formValue.enterpriseDuration,
            description: formValue.enterpriseDescription,
            clubId: clubId
          });

          forkJoin([createCommunity$, createBasic$, createPremium$, createEnterprise$]).subscribe({
            next: () => {
              const currentUser = this.authService.currentUser();
              if (currentUser) {
                currentUser.profileCompleted = true;
                this.authService.setUser(currentUser);
              }
              this.showSuccessAlert = true;
            },
            error: (err) => {
              console.error('Error creating linked resources:', err);
              alert('Club created, but an error occurred while creating subscriptions or community.');
              // We could still consider the profile "completed" and show success
              // or navigate away, but let's just show success for now.
              const currentUser = this.authService.currentUser();
              if (currentUser) {
                currentUser.profileCompleted = true;
                this.authService.setUser(currentUser);
              }
              this.showSuccessAlert = true;
            }
          });
        },
        error: (err) => {
          console.error('Error creating club:', err);
          alert('An error occurred while creating the club profile.');
        }
      });
    }
  }

  closeAlertAndNavigate() {
    this.showSuccessAlert = false;
    this.router.navigate(['/club/dashboard']);
  }
}