import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  
  getImageUrl(imagePath: string | undefined, type: 'product' | 'user' = 'product', name?: string): string {
    if (!imagePath || imagePath === 'undefined' || imagePath === 'null') {
      if (type === 'user') {
        const placeholderName = name || 'User';
        return `https://ui-avatars.com/api/?name=${placeholderName}&background=002f34&color=fff`;
      }
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }

    if (imagePath.startsWith('http')) return imagePath;

    const cleanPath = imagePath.replace(/^.*uploads[\\/]/, '');
    return `http://localhost:3200/uploads/${cleanPath.replace(/\\/g, '/')}`;
  }

  formatPrice(price: number | undefined | null): string {
    if (price === null || price === undefined) return 'Rs 0';
    
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  }
}
