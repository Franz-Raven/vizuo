export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string; 
  isOnline?: boolean;  
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderUsername: string;
  senderAvatar?: string;
  content: string;
  sentAt: string;      
  isRead: boolean;
}

export interface Conversation {
  id: number;
  createdAt: string;
  lastMessageAt: string;
  lastMessage?: {
    id: number;
    content: string;
    senderId: number;
  };
  unreadCount: number;
  participants: User[];
}

//api request types
export interface SendMessageRequest {
  content: string;
  attachmentId?: number;
}

export interface CreateConversationRequest {
  participantId: number;
  initialMessage?: string;
}

//api response types
export interface GetConversationsResponse {
  conversations: Conversation[];
}

export interface GetConversationMessagesResponse {
  messages: Message[];
}

export interface GetOrCreateConversationResponse {
  conversationId: number;
  message?: string;     // "Conversation created" or "Existing conversation found"
}

export interface SendMessageResponse {
  message: Message;
  status: string;       // "Message sent successfully" or error message for debugging 
}

export interface SearchUsersResponse {
  users: User[];
}

export interface UnreadCountResponse {
  unreadCount: number;
}

// props for components
export interface ChatListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  isLoading?: boolean;
}

export interface ChatWindowProps {
  conversation: Conversation | null;
  currentUserId: number;
  messages: Message[];
  isLoading?: boolean;
  onSendMessage: (content: string) => Promise<void>;
  onMarkAsRead: () => void;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showUsername?: boolean;
}

export interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: number;
  isSelected?: boolean;
  onClick: () => void;
}

// state management types
export interface MessagingState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  loading: {
    conversations: boolean;
    messages: boolean;
    sending: boolean;
  };
  error: string | null;
}

export interface NewWebsocketMessageEvent {
  type: "NEW_MESSAGE";
  payload: Message;
}

export interface WebSocketTypingIndicatorEvent {
  type: "TYPING";
  payload: {
    userId: number;
    conversationId: number;
    isTyping: boolean;
  };
}

export interface WebSocketMessageReadEvent {
  type: "MESSAGE_READ";
  payload: {
    messageId: number;
    conversationId: number;
    readBy: number;
  };
}

export type MessagingEvent = 
  | NewWebsocketMessageEvent 
  | WebSocketTypingIndicatorEvent 
  | WebSocketMessageReadEvent;

// utils
export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

export interface OptimisticMessage {
  status: MessageStatus;
}

export interface MessageFormData {
  content: string;
}

export interface ConversationFilters {
  search?: string;
  unreadOnly?: boolean;
  sortBy?: 'recent' | 'unread';
}