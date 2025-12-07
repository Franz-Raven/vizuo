import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Message } from '@/types/messaging';

class WebSocketService {
  private client: Client | null = null;
  private subscriptions = new Map<string, StompSubscription>();

  connect(userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('WebSocket connected');
          resolve();
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
          reject(new Error('WebSocket failed'));
        },
      });

      this.client.activate();
    });
  }

  subscribeToMessages(conversationId: number, onMessage: (msg: Message) => void) {
    if (!this.client) return () => {};

    const sub = this.client.subscribe(
      `/user/queue/messages/${conversationId}`,
      (message) => onMessage(JSON.parse(message.body))
    );

    this.subscriptions.set(`msg-${conversationId}`, sub);
    return () => {
      sub.unsubscribe();
      this.subscriptions.delete(`msg-${conversationId}`);
    };
  }

  subscribeToTyping(conversationId: number, onTyping: (data: any) => void) {
    if (!this.client) return () => {};

    const sub = this.client.subscribe(
      `/user/queue/typing/${conversationId}`,
      (message) => onTyping(JSON.parse(message.body))
    );

    this.subscriptions.set(`typing-${conversationId}`, sub);
    return () => {
      sub.unsubscribe();
      this.subscriptions.delete(`typing-${conversationId}`);
    };
  }

  sendMessage(conversationId: number, content: string) {
    if (!this.client?.connected) throw new Error('Not connected');

    this.client.publish({
      destination: `/app/chat/${conversationId}`,
      body: JSON.stringify({ content }),
    });
  }

  sendTyping(conversationId: number, isTyping: boolean) {
    if (!this.client?.connected) return;

    this.client.publish({
      destination: `/app/typing/${conversationId}`,
      body: JSON.stringify({ isTyping }),
    });
  }

  disconnect() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
    this.client?.deactivate();
    this.client = null;
  }

  isConnected() {
    return this.client?.connected ?? false;
  }
}

export const webSocketService = new WebSocketService();