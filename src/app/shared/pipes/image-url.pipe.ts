import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  transform(imagePath: string | undefined, type: 'product' | 'user' = 'product', name?: string): string {
    if (!imagePath || imagePath === 'undefined' || imagePath === 'null') {
      if (type === 'user') {
        const placeholderName = name || 'User';
        return `https://ui-avatars.com/api/?name=${placeholderName}&background=002f34&color=fff`;
      }
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }

    if (imagePath.startsWith('http')) return imagePath;

    // Remove anything before and including 'uploads/'
    const cleanPath = imagePath.replace(/^.*uploads[\\/]/, '');
    return `http://localhost:3200/uploads/${cleanPath.replace(/\\/g, '/')}`;
  }
}
