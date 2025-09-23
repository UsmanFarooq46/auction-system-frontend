import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auctions-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.component.html',
  styles: [`
    .auctions-list {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .header h1 {
      font-size: 2rem;
      font-weight: bold;
      color: #333;
    }
    
    .create-btn {
      background-color: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      text-decoration: none;
      transition: background-color 0.2s;
    }
    
    .create-btn:hover {
      background-color: #0056b3;
    }
    
    .auctions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .auction-card {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1rem;
      transition: box-shadow 0.2s;
    }
    
    .auction-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .auction-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #333;
    }
    
    .auction-card p {
      color: #666;
      margin-bottom: 1rem;
    }
    
    .auction-card span {
      font-size: 1.125rem;
      font-weight: bold;
      color: #28a745;
    }
  `]
})
export class ListComponent {
  mockAuctions = [
    {
      id: '1',
      title: 'Vintage Rolex Watch',
      description: 'Beautiful vintage Rolex watch in excellent condition',
      currentPrice: 2500,
      timeLeft: '2h 30m',
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: '2',
      title: 'Antique Painting',
      description: 'Rare 19th century oil painting by unknown artist',
      currentPrice: 1200,
      timeLeft: '5h 15m',
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: '3',
      title: 'Diamond Ring',
      description: 'Stunning diamond engagement ring, 1.5 carat',
      currentPrice: 3500,
      timeLeft: '1d 3h',
      image: 'https://via.placeholder.com/300x200'
    }
  ];
}