import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  error = signal('');
  loading = signal(false);
  hidePassword = signal(true);

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      loginAsRole: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.loginForm.value).subscribe({
      next: res => {
        this.loading.set(false);

    
        this.authService.saveAuth(res);


        if (res.role === 'Customer') {
          this.router.navigate(
            res.isProfileComplete
              ? ['/customer/dashboard']
              : ['/customer/profile']
          );
        }

        if (res.role === 'LoanOfficer') {
          this.router.navigate(['/loanofficer/dashboard']);
        }

        if (res.role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err.error || 'Invalid credentials');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
