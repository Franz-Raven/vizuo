"use client";

import { Conversation } from "@/types/messaging";
import ConversationItem from "./conversation-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type ChatListProps = {
  conversations: Conversation[];
  currentUserId: number;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading?: boolean;
};

function ChatList({
  conversations,
  currentUserId,
  onSelectConversation,
  isLoading = false,
}: ChatListProps) {
  return (
    <div className="flex flex-col h-full border-r border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold">Messages</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
        </p>
        
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10"
          />
        </div>
      </div>

{/* list of conversations */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <span className="text-muted-foreground text-lg">💬</span>
            </div>
            <p className="text-muted-foreground">No conversations yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Start a conversation with another user
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                currentUserId={currentUserId}
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
export default ChatList;