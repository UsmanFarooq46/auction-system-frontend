import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../state/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../state/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private store = inject(Store);

  // Signals for reactive state management
  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);

  // Form group with validation
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  constructor() {
    // Clear any existing error messages when form values change
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage.set(null);
    });

    this.store.select(selectAuthLoading).subscribe((loading) => this.isLoading.set(loading));
    this.store.select(selectAuthError).subscribe((err) => this.errorMessage.set(err));
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.performLogin();
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Perform the actual login
   */
  private async performLogin(): Promise<void> {
    this.errorMessage.set(null);
    const { email, password, rememberMe } = this.loginForm.value;
    if (!email || !password) return;
    this.store.dispatch(AuthActions.login({ credentials: { email, password }, rememberMe: !!rememberMe }));
  }

  /**
   * Simulate login API call
   */
  private simulateLogin(email: string, password: string,rememberMe?:boolean) {}

  /**
   * Handle login errors
   */
  private handleLoginError(error: any): void {
    console.error('Login error:', error);
    this.errorMessage.set(
      error?.message || 'An unexpected error occurred. Please try again.'
    );
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Handle forgot password
   */
  forgotPassword(): void {
    const email = this.loginForm.get('email')?.value;
    if (email && this.loginForm.get('email')?.valid) {
      // In a real app, this would trigger a password reset email
      alert(`Password reset instructions have been sent to ${email}`);
    } else {
      alert('Please enter a valid email address first');
    }
  }

  /**
   * Handle Google login
   */
  loginWithGoogle(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    // Simulate Google OAuth
    setTimeout(() => {
      const user = {
        id: '3',
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        role: 'USER' as any,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      // this.authService.login(user);
      this.router.navigate(['/']);
      this.isLoading.set(false);
    }, 1000);
  }

  /**
   * Handle Facebook login
   */
  loginWithFacebook(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    // Simulate Facebook OAuth
    setTimeout(() => {
      const user = {
        id: '4',
        email: 'user@facebook.com',
        firstName: 'Facebook',
        lastName: 'User',
        role: 'USER' as any,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      // this.authService.login(user);
      this.router.navigate(['/']);
      this.isLoading.set(false);
    }, 1000);
  }

  /**
   * Get form control for template access
   */
  getFormControl(controlName: string) {
    return this.loginForm.get(controlName);
  }
}