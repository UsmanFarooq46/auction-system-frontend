import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { User } from '../../../core/models/user.model';
import { selectAuthUser } from '../../../state/auth/auth.selectors';

interface Tab {
  id: string;
  name: string;
  icon: string;
}

interface Bid {
  item: string;
  auction: string;
  amount: number;
  date: string;
  status: 'Won' | 'Lost' | 'Active' | 'Outbid';
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private store = inject(Store);
  
  currentUser = signal<User | null>(null);
  activeTab = 'personal';
  isEditMode = signal(false);

  tabs: Tab[] = [
    { id: 'personal', name: 'Personal Information', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>' },
    { id: 'bidding', name: 'Bidding History', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>' },
    { id: 'security', name: 'Security & Privacy', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>' },
    { id: 'notifications', name: 'Notifications', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.5 19.5a3 3 0 01-3-3V5a3 3 0 013-3h9a3 3 0 013 3v11.5a3 3 0 01-3 3h-9z"></path>' }
  ];

  mockBids: Bid[] = [
    { item: 'Vintage Rolex Submariner', auction: 'Luxury Watches Auction', amount: 250000, date: '2024-01-15', status: 'Won' },
    { item: 'Antique Persian Rug', auction: 'Art & Collectibles', amount: 45000, date: '2024-01-10', status: 'Lost' },
    { item: 'MacBook Pro M3', auction: 'Electronics Auction', amount: 180000, date: '2024-01-08', status: 'Active' },
    { item: 'Diamond Engagement Ring', auction: 'Jewelry Collection', amount: 75000, date: '2024-01-05', status: 'Outbid' },
    { item: 'Classic Car Collection', auction: 'Automotive Auction', amount: 1200000, date: '2024-01-01', status: 'Won' }
  ];

  constructor() {
    this.store.select(selectAuthUser).subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  getMemberSince(): string {
    const user = this.currentUser();
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
    return 'January 2024';
  }

  getTabClasses(tabId: string): string {
    const baseClasses = 'relative py-4 px-6 font-medium text-sm transition-all duration-200 flex items-center justify-center min-w-0';
    const activeClasses = 'text-blue-600 bg-blue-50';
    const inactiveClasses = 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';
    
    return this.activeTab === tabId 
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  }

  getShortTabName(tabId: string): string {
    const shortNames = {
      'personal': 'Profile',
      'bidding': 'Bids',
      'security': 'Security',
      'notifications': 'Alerts'
    };
    
    return shortNames[tabId as keyof typeof shortNames] || tabId;
  }

  getBidStatusClass(status: string): string {
    const statusClasses = {
      'Won': 'bg-green-100 text-green-800',
      'Lost': 'bg-red-100 text-red-800',
      'Active': 'bg-blue-100 text-blue-800',
      'Outbid': 'bg-yellow-100 text-yellow-800'
    };
    
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  }

  toggleEditMode(): void {
    const currentMode = this.isEditMode();
    this.isEditMode.set(!currentMode);
    
    if (currentMode) {
      // Save changes logic here
      this.saveProfileChanges();
    }
  }

  openAvatarModal(): void {
    // Open avatar upload modal
    alert('Avatar upload modal would open here');
  }

  openSettingsModal(): void {
    // Open settings modal or navigate to settings page
    this.activeTab = 'security'; // Switch to security tab for settings
    console.log('Opening account settings...');
    // You can implement modal or navigation logic here
  }


  private saveProfileChanges(): void {
    // Implement save logic here
    console.log('Saving profile changes...');
    // You can dispatch NgRx actions here to update user data
  }

  getInputClasses(): string {
    const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-all duration-200';
    const editClasses = 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent';
    const readonlyClasses = 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed';
    
    return this.isEditMode() 
      ? `${baseClasses} ${editClasses}`
      : `${baseClasses} ${readonlyClasses}`;
  }

  getEditButtonClasses(): string {
    const baseClasses = 'inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden border-2';
    
    if (this.isEditMode()) {
      return `${baseClasses} text-white bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 focus:ring-emerald-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-emerald-400`;
    } else {
      return `${baseClasses} text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 focus:ring-blue-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-blue-400`;
    }
  }
}
