import { Injectable, NgZone, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import type { ChatMessage } from './chat-api.service';

type ChatErrorPayload = { message: string };

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
  private zone = inject(NgZone);
  private socket: Socket | null = null;

  private messageSubject = new Subject<ChatMessage>();
  private errorSubject = new Subject<ChatErrorPayload>();

  messages$: Observable<ChatMessage> = this.messageSubject.asObservable();
  errors$: Observable<ChatErrorPayload> = this.errorSubject.asObservable();

  connect(token: string): void {
    if (this.socket?.connected) return;

    const socketBaseUrl = environment.apiUrl.replace(/\/api\/?$/, '');

    this.socket = io(socketBaseUrl, {
      transports: ['websocket'],
      auth: { token },
    });

    this.socket.on('connect_error', (err) => {
      this.zone.run(() => this.errorSubject.next({ message: err?.message || 'Socket connection failed' }));
    });

    this.socket.on('chat:error', (payload: ChatErrorPayload) => {
      this.zone.run(() => this.errorSubject.next(payload));
    });

    this.socket.on('chat:new_message', (message: ChatMessage) => {
      this.zone.run(() => this.messageSubject.next(message));
    });
  }

  disconnect(): void {
    if (!this.socket) return;
    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.socket = null;
  }

  joinConversation(conversationId: string): void {
    this.socket?.emit('chat:join_conversation', { conversationId });
  }

  sendMessage(conversationId: string, text: string): void {
    this.socket?.emit('chat:send_message', { conversationId, text });
  }
}

