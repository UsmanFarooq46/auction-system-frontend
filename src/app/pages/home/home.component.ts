import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Featured auctions data
  featuredAuctions = [
    {
      id: 1,
      title: 'Vintage Rolex Submariner',
      description: 'Classic timepiece in excellent condition',
      currentBid: 8500,
      timeLeft: '2h 15m',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      status: 'live'
    },
    {
      id: 2,
      title: 'Antique Persian Rug',
      description: 'Hand-woven silk rug from 1920s',
      currentBid: 3200,
      timeLeft: '5h 30m',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      status: 'live'
    },
    {
      id: 3,
      title: 'Modern Art Painting',
      description: 'Contemporary abstract artwork',
      currentBid: 1200,
      timeLeft: '1d 3h',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1267?w=400',
      status: 'live'
    },
    {
      id: 4,
      title: 'Rare Wine Collection',
      description: 'Vintage Bordeaux collection (6 bottles)',
      currentBid: 4500,
      timeLeft: '3h 45m',
      image: 'https://images.unsplash.com/photo-1506377247375-2616b332c1b7?w=400',
      status: 'ending-soon'
    }
  ];

  // Categories data
  categories = [
    { name: 'Jewelry & Watches', count: 124, icon: '💎' },
    { name: 'Art & Collectibles', count: 89, icon: '🎨' },
    { name: 'Electronics', count: 156, icon: '📱' },
    { name: 'Fashion & Accessories', count: 203, icon: '👗' },
    { name: 'Home & Garden', count: 78, icon: '🏠' },
    { name: 'Sports & Recreation', count: 92, icon: '⚽' }
  ];

  // Statistics data
  stats = [
    { label: 'Active Auctions', value: '1,247', icon: '🔨' },
    { label: 'Total Users', value: '15,432', icon: '👥' },
    { label: 'Items Sold', value: '8,921', icon: '✅' },
    { label: 'Happy Customers', value: '98%', icon: '😊' }
  ];
}
