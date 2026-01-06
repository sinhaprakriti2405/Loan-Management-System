import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CustomerService } from '../../../services/customer-service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './my-profile.html',
  styleUrls: ['./my-profile.css']
})
export class MyProfile implements OnInit {

  isEdit = signal(false);
  loading = signal(true);
  message = signal('');

  profileForm!:FormGroup

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
    fullName: [''],
    annualIncome: [''],
    address: ['']
  });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.customerService.getProfile().subscribe({
      next: (res: any) => {
        if (res) {
          this.profileForm.patchValue(res);
          this.isEdit.set(true);
        }
        this.loading.set(false);
      },
      error: () => {
        
        this.isEdit.set(false);
        this.loading.set(false);
      }
    });
  }

  saveProfile() {
    const data = this.profileForm.value;

    const request = this.isEdit()
      ? this.customerService.updateProfile(data)
      : this.customerService.createProfile(data);

    request.subscribe(() => {
      this.message.set(
        this.isEdit()
          ? 'Profile updated successfully'
          : 'Profile saved successfully'
      );

      if (!this.isEdit()) {
        
        setTimeout(() => {
          this.router.navigate(['/customer/dashboard']);
        }, 1000);
      }
    });
  }
}
