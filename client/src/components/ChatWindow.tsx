import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { X, Send, MessageCircle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { ChatMessage, ChatConversation, TutorProfile } from '@shared/schema';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
  userType: 'student' | 'tutor';
  tutorId?: string;
  tutorEmail?: string;
  tutorName?: string;
  tutorPhotoUrl?: string;
  studentEmail?: string;
  studentName?: string;
}

export function ChatWindow({
  isOpen,
  onClose,
  userEmail,
  userName,
  userType,
  tutorId,
  tutorEmail,
  tutorName,
  tutorPhotoUrl,
  studentEmail,
  studentName,
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  // Determine the other party's info
  const otherEmail = userType === 'student' ? tutorEmail : studentEmail;
  const otherName = userType === 'student' ? tutorName : studentName;

  // Fetch existing messages for the conversation
  const { data: messages = [], isLoading: loadingMessages } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/messages', conversationId],
    enabled: !!conversationId,
  });

  // Create or get conversation
  const createConversationMutation = useMutation({
    mutationFn: async () => {
      if (userType === 'student') {
        const response = await apiRequest('POST', '/api/chat/conversations', {
          studentEmail: userEmail,
          studentName: userName,
          tutorId: tutorId,
          tutorEmail: tutorEmail,
          tutorName: tutorName,
        });
        return response.json();
      } else {
        const response = await apiRequest('POST', '/api/chat/conversations', {
          studentEmail: studentEmail,
          studentName: studentName,
          tutorId: tutorId,
          tutorEmail: userEmail,
          tutorName: userName,
        });
        return response.json();
      }
    },
    onSuccess: (data: ChatConversation) => {
      setConversationId(data.id);
    },
  });

  // Send message via HTTP fallback
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', '/api/chat/messages', {
        conversationId: conversationId,
        senderType: userType,
        senderEmail: userEmail,
        senderName: userName,
        receiverEmail: otherEmail,
        message: content,
      });
      return response.json();
    },
    onSuccess: (newMessage: ChatMessage) => {
      setLocalMessages(prev => [...prev, newMessage]);
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages', conversationId] });
    },
  });

  // Connect to WebSocket when chat opens
  useEffect(() => {
    if (!isOpen || !conversationId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/chat`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[Chat] WebSocket connected');
        setWsConnected(true);
        // Authenticate
        ws.send(JSON.stringify({
          type: 'auth',
          email: userEmail,
          userType: userType,
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('[Chat] Received:', data.type);
        
        if (data.type === 'new_message') {
          setLocalMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
        } else if (data.type === 'typing') {
          // Could show typing indicator
        } else if (data.type === 'messages_read') {
          queryClient.invalidateQueries({ queryKey: ['/api/chat/messages', conversationId] });
        }
      };

      ws.onclose = () => {
        console.log('[Chat] WebSocket disconnected');
        setWsConnected(false);
      };

      ws.onerror = (error) => {
        console.error('[Chat] WebSocket error:', error);
        setWsConnected(false);
      };

      return () => {
        ws.close();
      };
    } catch (error) {
      console.error('[Chat] Failed to connect WebSocket:', error);
    }
  }, [isOpen, conversationId, userEmail, userType]);

  // Create conversation when chat opens
  useEffect(() => {
    if (isOpen && !conversationId) {
      createConversationMutation.mutate();
    }
  }, [isOpen]);

  // Sync server messages with local messages
  useEffect(() => {
    if (messages.length > 0) {
      setLocalMessages(prev => {
        const newMessages = messages.filter(m => !prev.some(p => p.id === m.id));
        if (newMessages.length === 0) return prev;
        return [...prev, ...newMessages].sort((a, b) => 
          new Date(a.sentAt!).getTime() - new Date(b.sentAt!).getTime()
        );
      });
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || !conversationId) return;

    const content = messageInput.trim();
    setMessageInput('');

    // Try WebSocket first, fall back to HTTP
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        conversationId: conversationId,
        senderType: userType,
        senderEmail: userEmail,
        senderName: userName,
        receiverEmail: otherEmail,
        content: content,
      }));
    } else {
      sendMessageMutation.mutate(content);
    }
  }, [messageInput, conversationId, userType, userEmail, userName, otherEmail]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] shadow-xl z-50 flex flex-col" data-testid="chat-window">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={tutorPhotoUrl} alt={otherName || 'User'} />
            <AvatarFallback style={{ backgroundColor: 'hsl(var(--brand-blue))', color: 'white' }}>
              {otherName?.split(' ').map(n => n[0]).join('') || '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{otherName || 'Chat'}</CardTitle>
            <Badge variant={wsConnected ? 'default' : 'secondary'} className="text-xs">
              {wsConnected ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose} data-testid="button-close-chat">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <MessageCircle className="h-8 w-8 animate-pulse text-muted-foreground" />
            </div>
          ) : localMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mb-2" />
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {localMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderEmail === userEmail ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.senderEmail === userEmail
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                    data-testid={`chat-message-${msg.id}`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.senderEmail === userEmail ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {msg.sentAt && new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <div className="p-3 border-t flex gap-2">
        <Input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1"
          data-testid="input-chat-message"
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!messageInput.trim() || !conversationId}
          size="icon"
          data-testid="button-send-message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

// Floating chat button component
interface ChatButtonProps {
  onClick: () => void;
  unreadCount?: number;
}

export function ChatButton({ onClick, unreadCount = 0 }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-40"
      style={{ backgroundColor: 'hsl(var(--brand-blue))' }}
      data-testid="button-open-chat"
    >
      <MessageCircle className="h-6 w-6" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
}
