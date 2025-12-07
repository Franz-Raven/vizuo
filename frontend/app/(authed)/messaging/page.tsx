"use client"

import { useState, useEffect } from "react"
import ChatList from "@/components/messaging/chat-list"
import ChatWindow from "@/components/messaging/chat-window"
import { 
  getConversations, 
  sendMessage,
  getConversationMessages,
  markConversationAsRead,
  getOrCreateConversation,
  searchUsers
} from "@/lib/api/conversations"
import { getProfile } from "@/lib/api/profile"
import { toast } from "sonner"
import Header from "@/components/header"
import BackgroundBlobs from "@/components/background-blobs"
import { Search, UserPlus, X } from "lucide-react"
import type { 
  Conversation, 
  Message, 
  User,
  GetOrCreateConversationResponse
} from "@/types/messaging"

interface CurrentUser {
  id: number
  username: string
  email: string
  avatar?: string
  isOnline?: boolean
}

export default function MessagingPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  
  // New states for user search
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Helper function to get the other user from a conversation
  const getOtherUserFromConversation = (conversation: Conversation): User | undefined => {
    // According to your types, conversations have participants array
    if (conversation.participants && conversation.participants.length > 0) {
      // Find the participant that is not the current user
      return conversation.participants.find(p => p.id !== currentUser?.id)
    }
    return undefined
  }

  useEffect(() => {
    fetchCurrentUser()
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation?.id && currentUser) {
      fetchMessages(selectedConversation.id)
    }
  }, [selectedConversation?.id, currentUser])

  // Search users when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const delayDebounceFn = setTimeout(() => {
        handleSearchUsers(searchQuery)
      }, 300)

      return () => clearTimeout(delayDebounceFn)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchQuery])

  const fetchCurrentUser = async (): Promise<void> => {
    try {
      const response = await getProfile()
      setCurrentUser(response.user)
    } catch (error) {
      toast.error("Failed to load user data")
      console.error("User fetch error:", error)
    }
  }

  const fetchConversations = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await getConversations()
      setConversations(response.conversations || [])
    } catch (error) {
      toast.error("Failed to load conversations")
      console.error("Conversations fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async (conversationId: number): Promise<void> => {
    try {
      setIsLoadingMessages(true)
      const response = await getConversationMessages(conversationId)
      setMessages(response.messages || [])
      
      if (selectedConversation?.unreadCount && selectedConversation.unreadCount > 0) {
        await handleMarkAsRead()
      }
    } catch (error) {
      toast.error("Failed to load messages")
      console.error("Messages fetch error:", error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const handleSearchUsers = async (query: string): Promise<void> => {
    try {
      setIsSearching(true)
      const response = await searchUsers(query)
      
      const existingUserIds = conversations
        .map(conv => {
          const otherUser = getOtherUserFromConversation(conv)
          return otherUser?.id
        })
        .filter((id): id is number => id !== undefined)
      
      // Filter out current user and users you already have conversations with
      const filteredResults = response.users.filter(
        (user: User) => 
          user.id !== currentUser?.id && 
          !existingUserIds.includes(user.id)
      )
      
      setSearchResults(filteredResults)
      setShowSearchResults(true)
    } catch (error) {
      toast.error("Failed to search users")
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleStartNewConversation = async (user: User): Promise<void> => {
    try {
      const response: GetOrCreateConversationResponse = await getOrCreateConversation(user.id)
      
      const existingConversation = conversations.find(conv => conv.id === response.conversationId)
      
      if (existingConversation) {
        setSelectedConversation(existingConversation)
      } else {
        const newConversationObj: Conversation = {
          id: response.conversationId,
          participants: [user, currentUser!].filter(Boolean) as User[],
          createdAt: new Date().toISOString(),
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0,
          lastMessage: undefined
        }
        
        setConversations(prev => [newConversationObj, ...prev])
        setSelectedConversation(newConversationObj)
      }
      
      setSearchQuery("")
      setShowSearchResults(false)
      
      toast.success(`Started conversation with ${user.username}`)
    } catch (error) {
      toast.error("Failed to start conversation")
      console.error("Create conversation error:", error)
    }
  }

  const handleSendMessage = async (content: string): Promise<void> => {
    if (!selectedConversation || !currentUser) return
    
    try {
      const response = await sendMessage(selectedConversation.id, content);
      setMessages(prev => [...prev, response.message])
      await fetchConversations() // refresh to update last message
      toast.success("Message sent!")
    } catch (error) {
      toast.error("Failed to send message")
      console.error("Send message error:", error)
    }
  }

  const handleMarkAsRead = async (): Promise<void> => {
    if (!selectedConversation) return
    
    try {
      await markConversationAsRead(selectedConversation.id)
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      ))
    } catch (error) {
      console.error("Mark as read error:", error)
    }
  }

  if (!currentUser) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <BackgroundBlobs />
        <Header />
        <main className="relative z-10 pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading user data...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />
      <Header />
      
      <main className="relative z-10 pt-16">
        <div className="container mx-auto px-4 py-8">

          <div className="mb-6 relative">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search for users to message..."
                className="w-full pl-10 pr-10 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setShowSearchResults(false)
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 max-w-md bg-card border border-border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Searching...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {searchResults.map((user: User) => (
                      <button
                        key={user.id}
                        className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                        onClick={() => handleStartNewConversation(user)}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{user.username}</h3>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <UserPlus className="h-5 w-5 text-primary" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

{/* messaging container */}
          <div 
            className="bg-card rounded-xl border shadow-sm" 
            style={{ height: "calc(100vh - 280px)" }}
          >
            <div className="flex h-full">
              <div className="w-full md:w-1/3 border-r">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto">
                    <ChatList 
                      conversations={conversations}
                      currentUserId={currentUser.id}
                      onSelectConversation={setSelectedConversation}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <ChatWindow 
                  conversation={selectedConversation}
                  currentUserId={currentUser.id}
                  messages={messages}
                  isLoading={isLoadingMessages}
                  onSendMessage={handleSendMessage}
                  onMarkAsRead={handleMarkAsRead}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}