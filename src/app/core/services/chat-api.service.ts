import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export type Conversation = {
  _id: string;
  participants: Array<{
    _id: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string | null;
    role?: string;
  }>;
  auction?: any;
  lastMessageAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ChatMessage = {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string | null;
  };
  text: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  private api = inject(ApiService);

  createConversation(sellerId: string, auctionId?: string | null): Observable<ApiResponse<Conversation>> {
    return this.api.post<ApiResponse<Conversation>>('chat/conversations', {
      sellerId,
      auctionId: auctionId || null,
    });
  }

  getMessages(conversationId: string): Observable<ApiResponse<ChatMessage[]>> {
    return this.api.get<ApiResponse<ChatMessage[]>>(`chat/conversations/${conversationId}/messages`);
  }

  sendMessage(conversationId: string, text: string): Observable<ApiResponse<ChatMessage>> {
    return this.api.post<ApiResponse<ChatMessage>>(`chat/conversations/${conversationId}/messages`, { text });
  }

  getConversations(): Observable<ApiResponse<Conversation[]>> {
    return this.api.get<ApiResponse<Conversation[]>>('chat/conversations');
  }
}

