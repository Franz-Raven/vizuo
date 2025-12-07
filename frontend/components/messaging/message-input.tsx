"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Smile, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

type MessageInputProps = {
  onSend: (content: string) => void;
  onTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

function MessageInput({
  onSend,
  onTyping,
  disabled = false,
  placeholder = "Type a message...",
  className,
}: MessageInputProps) {
  const [input, setInput] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    if (onTyping && e.target.value.trim()) {
      onTyping();
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("flex items-end gap-2", className)}>
{/* attachment button but not yet working */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-muted-foreground"
        disabled={disabled}
      >
        <Paperclip className="h-5 w-5" />
      </Button>

{/* text input area */}
      <div className="flex-1 relative">
        <Textarea
          value={input}
           onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[40px] max-h-32 pr-12 resize-none"
          disabled={disabled}
          rows={1}
        />
        
{/* emoji button but not yet working */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 bottom-1 h-8 w-8 text-muted-foreground"
          disabled={disabled}
        >
          <Smile className="h-4 w-4" />
        </Button>
      </div>

      {/* send button */}
      <Button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        size="icon"
        className="h-10 w-10"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}

export default MessageInput;