import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { client } from '../../../../core/models/client.model'; 
@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-profile.component.html',
  styleUrls: ['../shared-forms.scss']
})
export class ClientProfileComponent implements OnInit {
  clientForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(12)]],
      poids: ['', [Validators.required, Validators.min(30)]],
      taille: ['', [Validators.required, Validators.min(100)]], 
      targetWeight: ['', [Validators.required, Validators.min(30)]],
      address: ['', Validators.required],
      fitnessGoal: ['', Validators.required],
      fitnessLevel: ['', Validators.required],
      imc: [{ value: '', disabled: true }]
    });

    this.clientForm.valueChanges.subscribe(() => this.calculateImc());
  }

  calculateImc(): void {
    const poids = this.clientForm.get('poids')?.value;
    const taille = this.clientForm.get('taille')?.value;
    
    if (poids && taille && taille > 0) {
      const imcVal = poids / ((taille / 100) * (taille / 100));
      this.clientForm.get('imc')?.setValue(imcVal.toFixed(2), { emitEvent: false });
    } else {
      this.clientForm.get('imc')?.setValue('', { emitEvent: false });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.clientForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submit() { 
    if (this.clientForm.valid) {
     
      const clientData: client = this.clientForm.getRawValue();
      console.log('Validated Client Structured Payload:', clientData); 
    }
  }
}