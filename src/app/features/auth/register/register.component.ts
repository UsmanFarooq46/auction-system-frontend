import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { TextFieldComponent } from '../../../shared/components/form/text-field/text-field.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TextFieldComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Signals for reactive state management
  isLoading = signal(false);
  showPassword = signal(false);

  // Registration form
  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      role: ['bidder', [Validators.required]],
      termsAccepted: [false, [Validators.requiredTrue]]
    });
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  // Handle form submission
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      
      // Prepare registration data
      const registrationData = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email?.toLowerCase(),
        password: this.registerForm.value.password,
        phone: this.registerForm.value.phone,
        dateOfBirth: this.registerForm.value.dateOfBirth,
        gender: this.registerForm.value.gender,
        role: this.registerForm.value.role || 'bidder'
      };

      // Call auth service to register user
      this.authService.register(registrationData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          console.log('Registration successful:', response);          
          this.showSuccessMessage();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Registration failed:', error);
          this.showErrorMessage(error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  // Mark all form fields as touched to trigger validation
  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Show success message
  private showSuccessMessage(): void {
    this.toast.success('Registration successful! Please sign in to continue.');
  }

  // Show error message
  private showErrorMessage(error: any): void {
    const message =
      error?.error?.message ||
      error?.message ||
      'An error occurred during registration. Please try again.';
    this.toast.error(message);
  }
}
