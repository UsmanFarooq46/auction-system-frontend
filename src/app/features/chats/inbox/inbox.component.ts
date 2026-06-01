import { CommonModule } from '@angular/common';
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatApiService, ChatMessage, Conversation } from '../../../core/services/chat-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChatSocketService } from '../../../core/services/chat-socket.service';

@Component({
  selector: 'app-chat-inbox',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-120px)] bg-[#f2f4f5] py-4 overflow-hidden">
      <div class="max-w-6xl mx-auto px-4">
        <div class="bg-white border border-gray-200 rounded shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-152px)]">
          <div class="md:col-span-1 border-r border-gray-200">
            <div class="px-4 py-3 border-b border-gray-200 bg-[#002f34] text-white">
              <h1 class="text-base font-bold">My Chats</h1>
              <p class="text-xs text-white/80">All your conversations</p>
            </div>

            @if (isLoading()) {
              <div class="p-4 text-sm text-gray-500">Loading chats...</div>
            } @else if (conversations().length === 0) {
              <div class="p-4 text-sm text-gray-500">No conversations yet.</div>
            } @else {
              <div class="divide-y divide-gray-100 h-[calc(100vh-240px)] overflow-y-auto">
                @for (conv of conversations(); track conv._id) {
                  <button
                    type="button"
                    (click)="openConversation(conv)"
                    class="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                    [class.bg-blue-50]="selectedConversationId() === conv._id"
                  >
                    <p class="font-semibold text-[#002f34]">{{ getOtherParticipantName(conv) }}</p>
                    @if (conv.auction?.title) {
                      <p class="text-xs text-gray-500 mt-1 truncate">Auction: {{ conv.auction?.title }}</p>
                    }
                    @if (conv.lastMessageAt) {
                      <p class="text-xs text-gray-400 mt-1">{{ conv.lastMessageAt | date:'short' }}</p>
                    }
                  </button>
                }
              </div>
            }
          </div>

          <div class="md:col-span-2 flex flex-col min-h-0">
            @if (!selectedConversationId()) {
              <div class="h-full flex flex-col items-center justify-center text-sm text-gray-500 p-6 text-center">
                @if (chatError()) {
                  <p class="text-red-600 font-semibold mb-1">Could not open this chat</p>
                  <p class="text-gray-500">{{ chatError() }}</p>
                } @else {
                  Select a chat from the left panel
                }
              </div>
            } @else {
              <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <p class="font-semibold text-[#002f34]">{{ selectedConversationName() }}</p>
              </div>

              <div class="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-[#f8f9fa]">
                @if (messagesLoading()) {
                  <p class="text-sm text-gray-500">Loading messages...</p>
                } @else if (messages().length === 0) {
                  <p class="text-sm text-gray-500">No messages yet. Start the conversation.</p>
                } @else {
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
                }
              </div>

              <div class="p-4 border-t border-gray-200">
                <form class="flex gap-2" (ngSubmit)="sendMessage()">
                  <input
                    type="text"
                    name="message"
                    [(ngModel)]="draftMessage"
                    placeholder="Type a message..."
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
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class InboxComponent implements OnDestroy {
  private chatApi = inject(ChatApiService);
  private authService = inject(AuthService);
  private chatSocket = inject(ChatSocketService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private subs = new Subscription();

  conversations = signal<Conversation[]>([]);
  messages = signal<ChatMessage[]>([]);
  isLoading = signal(true);
  messagesLoading = signal(false);
  isSending = signal(false);
  selectedConversationId = signal('');
  selectedConversationName = signal('Conversation');
  chatError = signal('');
  draftMessage = '';

  currentUserId = computed(() => {
    const user: any = this.authService.getCurrentUser();
    return user?._id || user?.id || '';
  });

  constructor() {
    const token = this.authService.getToken();
    if (token) {
      this.chatSocket.connect(token);
    }

    this.subs.add(
      this.chatSocket.messages$.subscribe((message) => {
        const selected = this.selectedConversationId();
        if (!selected) return;
        if (message.conversation?.toString?.() !== selected) return;

        this.messages.update((current) => {
          if (current.some((m) => m._id === message._id)) return current;
          return [...current, message];
        });
      })
    );

    this.subs.add(
      this.route.paramMap.subscribe((params) => {
        const routeConversationId = params.get('conversationId') || '';
        const sellerId = params.get('sellerId') || '';
        const auctionId = this.route.snapshot.queryParamMap.get('auctionId');

        this.loadConversations(routeConversationId, sellerId, auctionId);
      })
    );
  }

  loadConversations(routeConversationId = '', sellerId = '', auctionId: string | null = null): void {
    this.isLoading.set(true);
    this.subs.add(
      this.chatApi.getConversations().subscribe({
        next: (res) => {
          const list = res.data || [];
          this.conversations.set(list);
          this.isLoading.set(false);

          if (routeConversationId) {
            this.selectConversationById(routeConversationId);
            return;
          }

          if (sellerId) {
            this.createOrOpenBySeller(sellerId, auctionId);
            return;
          }

          if (list.length > 0) {
            this.openConversation(list[0], false);
          }
        },
        error: () => {
          this.isLoading.set(false);
        },
      })
    );
  }

  private createOrOpenBySeller(sellerId: string, auctionId: string | null): void {
    this.chatError.set('');
    this.subs.add(
      this.chatApi.createConversation(sellerId, auctionId).subscribe({
        next: (res) => {
          const conv = res.data;
          const exists = this.conversations().some((c) => c._id === conv._id);
          if (!exists) {
            this.conversations.update((current) => [conv, ...current]);
          }
          this.selectConversationById(conv._id);
          this.router.navigate(['/chats/conversation', conv._id], { replaceUrl: true });
        },
        error: (err) => {
          this.chatError.set(err?.message || 'Unable to start this conversation. Please try again.');
        },
      })
    );
  }

  getOtherParticipantName(conversation: Conversation): string {
    const me = this.currentUserId();
    const other = conversation.participants?.find((p) => p._id !== me) || conversation.participants?.[0];
    const full = `${other?.firstName || ''} ${other?.lastName || ''}`.trim();
    return full || 'Unknown user';
  }

  openConversation(conversation: Conversation, navigate = true): void {
    this.selectConversationById(conversation._id);
    if (navigate) {
      this.router.navigate(['/chats/conversation', conversation._id]);
    }
  }

  private selectConversationById(conversationId: string): void {
    const selected = this.conversations().find((c) => c._id === conversationId);
    this.selectedConversationId.set(conversationId);
    this.selectedConversationName.set(selected ? this.getOtherParticipantName(selected) : 'Conversation');

    this.chatSocket.joinConversation(conversationId);
    this.messagesLoading.set(true);
    this.subs.add(
      this.chatApi.getMessages(conversationId).subscribe({
        next: (res) => {
          this.messages.set(res.data || []);
          this.messagesLoading.set(false);
        },
        error: () => {
          this.messagesLoading.set(false);
        },
      })
    );
  }

  canSend(): boolean {
    return !!this.selectedConversationId() && this.draftMessage.trim().length > 0 && !this.isSending();
  }

  sendMessage(): void {
    const text = this.draftMessage.trim();
    const conversationId = this.selectedConversationId();
    if (!conversationId || !text) return;

    this.isSending.set(true);
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
        error: () => {
          this.isSending.set(false);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

