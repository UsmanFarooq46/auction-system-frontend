import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatApiService, ChatMessage, Conversation } from '../../../core/services/chat-api.service';
import { ChatSocketService } from '../../../core/services/chat-socket.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#f2f4f5] py-6">
      <div class="max-w-4xl mx-auto px-4">
        <div class="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-200 bg-[#002f34] text-white">
            <p class="text-xs uppercase tracking-widest font-semibold text-white/70 mb-1">Conversation</p>
            <h1 class="text-lg font-bold">
              {{ sellerName() }}
            </h1>
            @if (auctionId()) {
              <p class="text-xs text-white/80 mt-1">About auction #{{ auctionId() }}</p>
            }
          </div>

          <div class="h-[420px] overflow-y-auto p-4 space-y-3 bg-[#f8f9fa]">
            @for (message of messages(); track message._id) {
              <div class="flex" [class.justify-end]="message.sender?._id === currentUserId()">
                <div
                  class="max-w-[80%] px-4 py-2 rounded-lg text-sm"
                  [class.bg-[#d9fdd3]]="message.sender?._id === currentUserId()"
                  [class.bg-white]="message.sender?._id !== currentUserId()"
                  [class.border]="message.sender?._id !== currentUserId()"
                  [class.border-gray-200]="message.sender?._id !== currentUserId()"
                >
                  <p>{{ message.text }}</p>
                </div>
              </div>
            }
          </div>

          <div class="p-4 border-t border-gray-200">
            <form class="flex gap-2" (ngSubmit)="sendMessage()">
              <input
                type="text"
                name="message"
                [(ngModel)]="draftMessage"
                placeholder="Type your message to seller..."
                class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a77ff]"
              />
              <button
                type="submit"
                [disabled]="!canSend()"
                class="px-4 py-2 bg-[#002f34] text-white rounded text-sm font-semibold disabled:opacity-50"
              >
                {{ isSending() ? 'Sending...' : 'Send' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ConversationComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private chatApi = inject(ChatApiService);
  private chatSocket = inject(ChatSocketService);
  public authService = inject(AuthService);

  private subs = new Subscription();

  sellerId = this.route.snapshot.paramMap.get('sellerId') || '';
  routeConversationId = this.route.snapshot.paramMap.get('conversationId') || '';
  sellerName = signal(this.route.snapshot.queryParamMap.get('sellerName') || 'Seller');
  auctionId = signal(this.route.snapshot.queryParamMap.get('auctionId') || '');
  conversationId = signal<string>('');
  isSending = signal(false);
  draftMessage = '';

  messages = signal<ChatMessage[]>([]);

  constructor() {
    const token = this.authService.getToken();
    if (!token) {
      // Route is protected by AuthGuard; this is just a safety net.
      return;
    }

    this.chatSocket.connect(token);

    // Open an existing thread from inbox.
    if (this.routeConversationId) {
      this.conversationId.set(this.routeConversationId);
      this.chatSocket.joinConversation(this.routeConversationId);
      this.loadMessages(this.routeConversationId);
    } else if (this.sellerId) {
      // Start/create thread when entering from "chat with seller" flow.
      this.subs.add(
        this.chatApi
          .createConversation(this.sellerId, this.auctionId())
          .subscribe({
            next: (res) => {
              const conversation = res.data as Conversation;
              this.conversationId.set(conversation._id);

              this.chatSocket.joinConversation(conversation._id);
              this.loadMessages(conversation._id);
            },
            error: (err: any) => {
              alert(err?.message || 'Failed to start conversation');
            },
          })
      );
    }

    // Live messages
    this.subs.add(
      this.chatSocket.messages$.subscribe((message) => {
        const cid = this.conversationId();
        if (!cid) return;
        if (message.conversation?.toString?.() && message.conversation.toString() !== cid) return;

        this.messages.update((current) => {
          if (current.some((m) => m._id === message._id)) return current;
          return [...current, message];
        });
      })
    );

    this.subs.add(
      this.chatSocket.errors$.subscribe((e) => {
        if (e?.message) alert(e.message);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    // Keep socket connection app-wide; do not forcibly disconnect here.
  }

  private loadMessages(conversationId: string): void {
    this.subs.add(
      this.chatApi.getMessages(conversationId).subscribe({
        next: (res) => {
          this.messages.set(res.data || []);
        },
        error: (err: any) => {
          alert(err?.message || 'Failed to load messages');
        },
      })
    );
  }

  sendMessage(): void {
    const text = this.draftMessage.trim();
    if (!text) {
      return;
    }

    const conversationId = this.conversationId();
    if (!conversationId) {
      if (!this.sellerId) {
        this.isSending.set(false);
        alert('Conversation not found. Please open this chat from your inbox.');
        return;
      }

      this.isSending.set(true);
      this.subs.add(
        this.chatApi.createConversation(this.sellerId, this.auctionId()).subscribe({
          next: (res) => {
            const conversation = res.data as Conversation;
            this.conversationId.set(conversation._id);
            this.chatSocket.joinConversation(conversation._id);
            this.sendThroughApi(conversation._id, text);
          },
          error: (err: any) => {
            this.isSending.set(false);
            alert(err?.message || 'Failed to start conversation');
          },
        })
      );
      return;
    }

    this.isSending.set(true);
    this.sendThroughApi(conversationId, text);
  }

  private sendThroughApi(conversationId: string, text: string): void {
    this.subs.add(
      this.chatApi.sendMessage(conversationId, text).subscribe({
        next: (res) => {
          const sent = res.data;
          this.messages.update((current) => {
            if (current.some((m) => m._id === sent._id)) return current;
            return [...current, sent];
          });
          this.draftMessage = '';
          this.isSending.set(false);
        },
        error: (err: any) => {
          this.isSending.set(false);
          alert(err?.message || 'Failed to send message');
        },
      })
    );
  }

  canSend(): boolean {
    return this.draftMessage.trim().length > 0 && !this.isSending();
  }

  currentUserId(): string | undefined {
    const user: any = this.authService.getCurrentUser();
    return user?._id || user?.id;
  }
}
