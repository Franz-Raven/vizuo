import { apiRequest } from "@/lib/api";
import type {
  Conversation,
  Message,
  User
} from "@/types/messaging";

export interface SendMessageRequest {
  content: string;
  attachmentId?: number;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
}

export interface GetConversationMessagesResponse {
  messages: Message[];
}

export interface GetOrCreateConversationResponse {
  conversationId: number;
  message?: string;
}

export interface SendMessageResponse {
  message: Message;
  status: string;
}

export interface SearchUsersResponse {
  users: User[];
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export async function getConversations(): Promise<GetConversationsResponse> {
  return apiRequest<GetConversationsResponse>("/conversations");
}

export async function getConversationMessages(
  conversationId: number
): Promise<GetConversationMessagesResponse> {
  return apiRequest<GetConversationMessagesResponse>(
    `/conversations/${conversationId}/messages`
  );
}

export async function getOrCreateConversation(
  otherUserId: number
): Promise<GetOrCreateConversationResponse> {
  return apiRequest<GetOrCreateConversationResponse>(
    `/conversations/with/${otherUserId}`,
    {
      method: "POST"
    }
  );
}

export async function sendMessage(
  conversationId: number,
  data: SendMessageRequest
): Promise<SendMessageResponse> {
  return apiRequest<SendMessageResponse>(
    `/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  );
}

export async function markConversationAsRead(
  conversationId: number
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/conversations/${conversationId}/mark-read`,
    {
      method: "POST"
    }
  );
}

export async function searchUsers(
  query: string
): Promise<SearchUsersResponse> {
  return apiRequest<SearchUsersResponse>(
    `/conversations/search-users?query=${encodeURIComponent(query)}`
  );
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  return apiRequest<UnreadCountResponse>("/conversations/unread-count");
}