import { User } from './user.model';
import { Bid } from './bid.model';

export interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  reservePrice?: number;
  startTime: Date;
  endTime: Date;
  status: AuctionStatus;
  category: AuctionCategory;
  seller: User;
  images: string[];
  bids: Bid[];
  winner?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuctionCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
}

export enum AuctionStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled'
}

export interface CreateAuctionRequest {
  title: string;
  description: string;
  startingPrice: number;
  reservePrice?: number;
  endTime: Date;
  categoryId: string;
  images: string[];
}

export interface UpdateAuctionRequest {
  title?: string;
  description?: string;
  reservePrice?: number;
  endTime?: Date;
  categoryId?: string;
  images?: string[];
}
