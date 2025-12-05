"use client";

import { useState, useEffect, useRef } from "react";
import { Conversation, Message } from "@/types/messaging";
import MessageBubble from "./message-bubble";
import MessageInput from "./message-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";

type ChatWindowProps = {
  conversation: Conversation | null;
  currentUserId: number;
  messages: Message[];
  isLoading?: boolean;
  onSendMessage: (content: string) => Promise<void>;
  onMarkAsRead: () => void;
  onBack?: () => void;
};

function ChatWindow({
  conversation,
  currentUserId,
  messages,
  isLoading = false,
  onSendMessage,
  onMarkAsRead,
  onBack,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark as read when conversation changes
  useEffect(() => {
    if (conversation?.id && conversation.unreadCount > 0) {
      onMarkAsRead();
    }
  }, [conversation?.id, conversation?.unreadCount, onMarkAsRead]);

  const handleSend = async (content: string) => {
    if (!content.trim() || isSending) return;
    
    setIsSending(true);
    try {
      await onSendMessage(content);
    } finally {
      setIsSending(false);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-muted-foreground text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">
            Choose a chat from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  // Get other participant for 1-on-1 chats
  const otherParticipant = conversation.participants.find(
    (user) => user.id !== currentUserId
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={otherParticipant?.avatar} 
              alt={otherParticipant?.username}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {otherParticipant?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-semibold">{otherParticipant?.username || "Unknown User"}</h3>
            <p className="text-xs text-muted-foreground">
              {otherParticipant?.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <span className="text-muted-foreground text-2xl">👋</span>
            </div>
            <h3 className="font-semibold mb-2">Start a conversation</h3>
            <p className="text-muted-foreground text-sm">
              Send your first message to {otherParticipant?.username || "this user"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <MessageInput
          onSend={handleSend}
          disabled={isSending}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
}
export default ChatWindow;