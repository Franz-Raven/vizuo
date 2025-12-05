"use client";

import { Conversation } from "@/types/messaging";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ConversationItemProps = {
  conversation: Conversation;
  currentUserId: number;
  onClick: () => void;
  isSelected?: boolean;
};

function ConversationItem({
  conversation,
  currentUserId,
  onClick,
  isSelected = false,
}: ConversationItemProps) {
  const otherParticipant = conversation.participants.find(
    (user) => user.id !== currentUserId
  );

  const lastMessage = conversation.lastMessage;
  const hasUnread = conversation.unreadCount > 0;
  
const time = new Date(conversation.lastMessageAt).toLocaleTimeString([], { 
  hour: "2-digit", 
  minute: "2-digit" 
});

  return (
    <div
      className={cn(
        "p-4 hover:bg-accent cursor-pointer transition-colors group",
        isSelected && "bg-accent",
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-background">
            <AvatarImage 
              src={otherParticipant?.avatar} 
              alt={otherParticipant?.username}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {otherParticipant?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
{/* Online indicator */}
          {otherParticipant?.isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold truncate">
              {otherParticipant?.username || "Unknown User"}
            </h3>
            {time && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {time}
              </span>
            )}
          </div>

{/* Last message preview */}
          <div className="flex items-center gap-2 mt-1">
            {lastMessage ? (
              <>
                <p className="text-sm text-muted-foreground truncate flex-1">
                  {lastMessage.senderId === currentUserId
                    ? `You: ${lastMessage.content}`
                    : lastMessage.content}
                </p>
                {hasUnread && (
                  <Badge 
                    variant="destructive" 
                    className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {conversation.unreadCount}
                  </Badge>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Start a conversation...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ConversationItem;