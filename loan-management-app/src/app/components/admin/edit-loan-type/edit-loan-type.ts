import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../../services/admin-service';

@Component({
  selector: 'app-edit-loan-type',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-loan-type.html',
  styleUrls: ['./edit-loan-type.css']
})
export class EditLoanType {

  loanTypeId!: number;
  loanTypeName!: string;

  loading = signal(true);
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.loanTypeId = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group({
      name: [{ value: '', disabled: true }],
      interestRate: ['', Validators.required],
      minAmount: ['', Validators.required],
      maxAmount: ['', Validators.required],
      maxTenure: ['', Validators.required]
    });

    this.loadLoanType();
  }

  
  loadLoanType() {
    this.adminService.getLoanTypes().subscribe(types => {
      const loanType = types.find(l => l.loanTypeId === this.loanTypeId);

      if (!loanType) {
        this.router.navigate(['/admin/manage-loan-types']);
        return;
      }

     
      this.loanTypeName = loanType.name;

      this.form.patchValue({
        name: loanType.name,
        interestRate: loanType.interestRate,
        minAmount: loanType.minAmount,
        maxAmount: loanType.maxAmount,
        maxTenure: loanType.maxTenure
      });

      this.loading.set(false);
    });
  }

  
  updateLoanType() {
    if (this.form.invalid) return;

    const payload = {
      LoanTypeId: this.loanTypeId,
      Name: this.form.getRawValue().name,
      InterestRate: this.form.value.interestRate,
      MinAmount: this.form.value.minAmount,
      MaxAmount: this.form.value.maxAmount,
      MaxTenure: this.form.value.maxTenure
    };

    this.adminService.updateLoanType(this.loanTypeId, payload)
      .subscribe({
        next: () => {
          alert('Loan type updated successfully');
          this.router.navigate(['/admin/manage-loan-types']);
        },
        error: (err) => {
          console.error(err);
          alert('Update failed. Please try again.');
        }
      });
  }

  
  cancel() {
    this.router.navigate(['/admin/manage-loan-types']);
  }
}
