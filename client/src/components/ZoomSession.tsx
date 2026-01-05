import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Video, PhoneOff, Users } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ZoomSessionProps {
  sessionName: string;
  userName: string;
  tutorName: string;
  subject: string;
  isHost?: boolean;
}

export function ZoomSession({ sessionName, userName, tutorName, subject, isHost = false }: ZoomSessionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  const joinSession = useCallback(async () => {
    if (!containerRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/zoom/session-token', {
        sessionName,
        userName,
        role: isHost ? 1 : 0,
      });
      
      const data = await response.json();
      
      if (!data.success || !data.token) {
        throw new Error(data.message || 'Failed to get session token');
      }
      
      const uitoolkit = await import('@zoom/videosdk-ui-toolkit');
      await import('@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css');
      
      const config = {
        videoSDKJWT: data.token,
        sessionName: data.sessionName,
        userName: userName,
        sessionPasscode: '',
        featuresOptions: {
          preview: ['video', 'audio'] as ('video' | 'audio')[],
          video: true,
          audio: true,
          share: true,
          chat: true,
          users: true,
          settings: true,
          recording: isHost,
          leave: true,
          virtualBackground: true,
          footer: true,
          header: true,
        },
      };
      
      uitoolkit.default.joinSession(containerRef.current, config);
      setIsJoined(true);
      
      uitoolkit.default.onSessionDestroyed(() => {
        setIsJoined(false);
        uitoolkit.default.destroy();
      });
      
    } catch (err: any) {
      console.error('Zoom session error:', err);
      setError(err.message || 'Failed to join session');
    } finally {
      setIsLoading(false);
    }
  }, [sessionName, userName, isHost]);

  const leaveSession = useCallback(async () => {
    if (containerRef.current) {
      try {
        const uitoolkit = await import('@zoom/videosdk-ui-toolkit');
        uitoolkit.default.closeSession(containerRef.current);
        setIsJoined(false);
      } catch (err) {
        console.error('Error leaving session:', err);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (isJoined && containerRef.current) {
        import('@zoom/videosdk-ui-toolkit').then((uitoolkit) => {
          uitoolkit.default.closeSession(containerRef.current!);
          uitoolkit.default.destroy();
        }).catch(() => {});
      }
    };
  }, [isJoined]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Video className="w-5 h-5 text-blue-600" />
          Tutoring Session: {subject} with {tutorName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isJoined && (
          <div className="text-center space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Ready to Start Your Session?
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                Click the button below to join your tutoring session with {tutorName}
              </p>
              <Button
                onClick={joinSession}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
                data-testid="button-join-session"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5 mr-2" />
                    Join Session
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        )}
        
        <div 
          ref={containerRef} 
          className="w-full rounded-lg overflow-hidden"
          style={{ 
            minHeight: isJoined || isLoading ? '480px' : '0',
            display: isJoined || isLoading ? 'block' : 'none'
          }}
          data-testid="zoom-session-container"
        />
        
        {isJoined && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={leaveSession}
              variant="destructive"
              size="lg"
              data-testid="button-leave-session"
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              Leave Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
