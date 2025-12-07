import { apiRequest } from "@/lib/api";
import type { Conversation, Message, User } from "@/types/messaging";

export async function getConversations() {
  return apiRequest<{ conversations: Conversation[] }>("/conversations");
}

export async function getConversationMessages(conversationId: number) {
  return apiRequest<{ messages: Message[] }>(
    `/conversations/${conversationId}/messages`
  );
}

export async function getOrCreateConversation(otherUserId: number) {
  return apiRequest<{ conversationId: number; message?: string }>(
    `/conversations/with/${otherUserId}`,
    {
      method: "POST"
    }
  );
}

export async function sendMessage(conversationId: number, content: string) {
  return apiRequest<{ message: Message; status: string }>(
    `/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content })
    }
  );
}

export async function markConversationAsRead(conversationId: number) {
  return apiRequest<{ message: string }>(
    `/conversations/${conversationId}/mark-read`,
    {
      method: "POST",
      credentials: "include",
    }
  );
}

export async function searchUsers(query: string) {
  return apiRequest<{ users: User[] }>(
    `/conversations/search-users?query=${encodeURIComponent(query)}`
  );
}

export async function getUnreadCount() {
  return apiRequest<{ unreadCount: number }>("/conversations/unread-count");
}