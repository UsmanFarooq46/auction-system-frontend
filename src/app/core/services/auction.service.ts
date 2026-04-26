import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Auction } from '../models/auction.model';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auction`;

  /**
   * Create a new auction with images
   * @param auctionData The auction form data
   * @returns Observable of the created auction
   */
  createAuction(auctionData: any): Observable<any> {
    const formData = new FormData();
    
    // Append all fields except images to FormData
    Object.keys(auctionData).forEach(key => {
      if (key !== 'images') {
        if (auctionData[key] !== null && auctionData[key] !== undefined) {
          formData.append(key, auctionData[key]);
        }
      }
    });

    // Append images
    if (auctionData.images && auctionData.images.length > 0) {
      auctionData.images.forEach((file: File) => {
        formData.append('images', file, file.name);
      });
    }

    return this.http.post<any>(this.apiUrl, formData);
  }

  /**
   * Get all auctions with optional filtering
   */
  getAuctions(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * Get auction by ID
   */
  getAuctionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get current user's auctions
   */
  getMyAuctions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-auctions`);
  }

  /**
   * Update auction
   */
  updateAuction(id: string, auctionData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, auctionData);
  }

  /**
   * Delete auction
   */
  deleteAuction(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
