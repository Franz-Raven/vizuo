"use client";

import { Message } from "@/types/messaging";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

type MessageBubbleProps = {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showUsername?: boolean;
};

function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  showUsername = !isOwn,
}: MessageBubbleProps) {
  const time = new Date(message.sentAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn(
      "flex items-end gap-2 group",
      isOwn ? "justify-end" : "justify-start",
    )}>
{/* other person's avatar */}
      {!isOwn && showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.senderAvatar} alt={message.senderUsername} />
          <AvatarFallback className="text-xs">
            {message.senderUsername?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      )}

{/* msg bubble */}
      <div className={cn(
        "flex flex-col max-w-[70%]",
        isOwn ? "items-end" : "items-start",
      )}>
        {!isOwn && showUsername && (
          <span className="text-xs font-medium text-muted-foreground mb-1 ml-1">
            {message.senderUsername}
          </span>
        )}

        <div className={cn(
          "rounded-2xl px-4 py-2 break-words",
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm",
        )}>
          <p className="text-sm">{message.content}</p>
        </div>

{/* Time and read status */}
        <div className={cn(
          "flex items-center gap-1 mt-1 text-xs",
          isOwn 
            ? "text-muted-foreground" 
            : "text-muted-foreground ml-1",
        )}>
          <span>{time}</span>
          {isOwn && (
            <span className="opacity-70">
              {message.isRead ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>

      {isOwn && showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.senderAvatar} alt="You" />
          <AvatarFallback className="text-xs">You</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
export default MessageBubble;