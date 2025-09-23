import { User } from './user.model';

export interface Bid {
  id: string;
  auctionId: string;
  bidder: User;
  amount: number;
  timestamp: Date;
  isWinning: boolean;
  isAutoBid: boolean;
  maxBidAmount?: number;
}

export interface CreateBidRequest {
  auctionId: string;
  amount: number;
  isAutoBid?: boolean;
  maxBidAmount?: number;
}

export interface BidHistory {
  auctionId: string;
  bids: Bid[];
  totalBids: number;
  highestBid: Bid | null;
  userBids: Bid[];
}
