import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

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
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const { email, password, rememberMe } = this.loginForm.value;
      
      // Simulate API call with delay
      const user = await this.simulateLogin(email, password);
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Login the user
      this.authService.login(user);

      // Navigate to home page on success
      this.router.navigate(['/']);
      
    } catch (error) {
      this.handleLoginError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Simulate login API call
   */
  private simulateLogin(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate different scenarios
        if (email === 'demo@auctionhub.com' && password === 'password123') {
          // Successful login
          resolve({
            id: '1',
            email: email,
            firstName: 'Demo',
            lastName: 'User',
            role: 'USER' as any,
            isEmailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else if (email === 'admin@auctionhub.com' && password === 'admin123') {
          // Admin login
          resolve({
            id: '2',
            email: email,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN' as any,
            isEmailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else {
          // Invalid credentials
          reject(new Error('Invalid email or password. Try demo@auctionhub.com / password123'));
        }
      }, 1500); // Simulate network delay
    });
  }

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