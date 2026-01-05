import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, Mail, Video, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ZoomSession } from "@/components/ZoomSession";

export default function PaymentSuccess() {
  const [tutorName, setTutorName] = useState('your tutor');
  const [subject, setSubject] = useState('your subject');
  const [studentName, setStudentName] = useState('Student');
  const [sessionId, setSessionId] = useState('');
  const [showZoom, setShowZoom] = useState(false);

  useEffect(() => {
    document.title = "Payment Successful - Be Smart Online Tutorials";
    
    const storedTutorName = sessionStorage.getItem('bookingTutorName');
    const storedSubject = sessionStorage.getItem('bookingSubject');
    const storedStudentName = sessionStorage.getItem('studentName');
    
    if (storedTutorName) setTutorName(storedTutorName);
    if (storedSubject) setSubject(storedSubject);
    if (storedStudentName) setStudentName(storedStudentName);
  }, []);

  const handleJoinSession = () => {
    if (sessionId.trim()) {
      setShowZoom(true);
    }
  };

  const sessionName = sessionId.trim() ? `bsot-session-${sessionId.trim()}` : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl text-green-700 dark:text-green-400">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Thank you for your payment! Your booking for <strong>{subject}</strong> with <strong>{tutorName}</strong> is being processed.
            </p>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-left text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                    Important: Send Proof of Payment
                  </p>
                  <p className="text-amber-700 dark:text-amber-400">
                    Please email your proof of payment to{" "}
                    <a 
                      href="mailto:onlinepresenceimpact@gmail.com" 
                      className="font-medium underline"
                    >
                      onlinepresenceimpact@gmail.com
                    </a>
                    {" "}with your tutor name and subject.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" />
              Join Your Tutoring Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Your tutor will provide you with a session ID. Enter it below to join your video session.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="sessionId">Session ID</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="sessionId"
                    placeholder="Enter session ID from your tutor"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="pl-10"
                    data-testid="input-session-id"
                  />
                </div>
                <Button 
                  onClick={handleJoinSession}
                  disabled={!sessionId.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                  data-testid="button-join-with-id"
                >
                  Join
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {showZoom && sessionName && (
          <ZoomSession
            sessionName={sessionName}
            userName={studentName}
            tutorName={tutorName}
            subject={subject}
            isHost={false}
          />
        )}

        <div className="text-center">
          <Button asChild variant="outline" data-testid="button-back-home">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
