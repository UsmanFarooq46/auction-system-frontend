export interface Payment {
  id: string;
  auctionId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId: string;
  createdAt: Date;
  processedAt?: Date;
  failureReason?: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  STRIPE = 'stripe'
}

export interface PaymentRequest {
  auctionId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  cardDetails?: CardDetails;
}

export interface CardDetails {
  number: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  name: string;
}
