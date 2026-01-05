import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, Mail, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentSuccess() {
  const [tutorName, setTutorName] = useState('your tutor');
  const [subject, setSubject] = useState('your subject');
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Payment Successful - Be Smart Online Tutorials";
    
    // Get booking info from session storage
    const storedTutorName = sessionStorage.getItem('bookingTutorName');
    const storedSubject = sessionStorage.getItem('bookingSubject');
    const storedZoomUrl = sessionStorage.getItem('tutorZoomUrl');
    
    if (storedTutorName) setTutorName(storedTutorName);
    if (storedSubject) setSubject(storedSubject);
    if (storedZoomUrl) setZoomUrl(storedZoomUrl);
  }, []);

  const handleJoinZoom = () => {
    if (zoomUrl) {
      window.open(zoomUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="max-w-md w-full text-center">
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

          {zoomUrl && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex flex-col items-center gap-3">
                <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <p className="font-medium text-blue-800 dark:text-blue-300">
                  Ready to join your session?
                </p>
                <Button
                  onClick={handleJoinZoom}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                  data-testid="button-join-zoom"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Join Zoom Meeting
                </Button>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Your tutor will start the meeting at your scheduled time
                </p>
              </div>
            </div>
          )}

          <Button asChild className="w-full mt-4" variant="outline" data-testid="button-back-home">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
