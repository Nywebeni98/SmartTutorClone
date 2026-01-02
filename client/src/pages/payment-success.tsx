import { useEffect, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CheckCircle, Video, Loader2, ArrowLeft, User, Mail, Phone, Calendar, Clock, BookOpen, Copy } from 'lucide-react';

interface BookingDetails {
  id: string;
  tutorId: string;
  tutorName?: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  subject?: string;
  hours: number;
  amount: number;
  paymentStatus: string;
  meetingLink?: string | null;
  slotDate?: string;
  slotTime?: string;
}

interface TutorDetails {
  name: string;
  email: string | null;
  phone: string | null;
  googleMeetUrl: string | null;
}

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [tutorDetails, setTutorDetails] = useState<TutorDetails | null>(null);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [showMeetingAlert, setShowMeetingAlert] = useState(false);

  // Extract bookingId from URL query parameters
  const urlParams = new URLSearchParams(searchString);
  const bookingId = urlParams.get('bookingId');

  // Complete the booking when we have a bookingId
  const completeBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('POST', `/api/payment/complete/${id}`, {});
      return response.json();
    },
    onSuccess: (data: any) => {
      if (data.success) {
        setBookingComplete(true);
        setBookingDetails(data.booking);
        setTutorDetails(data.tutorDetails);
        const link = data.tutorDetails?.googleMeetUrl || data.meetingLink || null;
        setMeetingLink(link);
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['/api/booking-payments'] });
        queryClient.invalidateQueries({ queryKey: ['/api/availability'] });
        
        toast({
          title: 'Booking Confirmed!',
          description: 'Your tutoring session has been booked successfully.',
        });
        
        // Show meeting link alert if available
        if (link) {
          setShowMeetingAlert(true);
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete booking. Please contact support.',
        variant: 'destructive',
      });
    },
  });

  // Automatically complete booking when page loads with bookingId
  useEffect(() => {
    if (bookingId && !bookingComplete && !completeBookingMutation.isPending) {
      completeBookingMutation.mutate(bookingId);
    }
  }, [bookingId]);

  // Clear session storage on mount
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  // No booking ID found
  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Payment Received</CardTitle>
            <CardDescription>
              If you've completed a payment, please click below to book a new session.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => setLocation('/')}
              data-testid="button-back-home"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Home Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (completeBookingMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl">Processing Payment...</CardTitle>
            <CardDescription>
              Please wait while we confirm your payment and prepare your session details.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Booking complete - show success and meeting link
  if (bookingComplete && bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        {/* Important: Google Meet Link Alert Dialog */}
        <AlertDialog open={showMeetingAlert} onOpenChange={setShowMeetingAlert}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Video className="h-10 w-10 text-blue-600" />
              </div>
              <AlertDialogTitle className="text-center text-xl">
                Important: Your Google Meet Link
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center space-y-3">
                <div className="bg-orange-100 dark:bg-orange-950/50 p-4 rounded-lg border-2 border-orange-400 dark:border-orange-600">
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    PLEASE SHARE YOUR PROOF OF PAYMENT TO:
                  </p>
                  <p className="text-xl font-bold text-orange-700 dark:text-orange-300 mt-1">
                    onlinepresenceimpact@gmail.com
                  </p>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mt-2">
                    Include your TUTOR NAME and SUBJECT in the email.
                  </p>
                  <p className="text-base font-semibold text-orange-600 dark:text-orange-400 mt-2">
                    A Google Meet link will be shared with you.
                  </p>
                </div>
                <p>
                  You will use this Google Meet link to join your tutoring session at the scheduled time.
                </p>
                {meetingLink && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="font-medium text-blue-800 dark:text-blue-200 break-all text-sm">
                      {meetingLink}
                    </p>
                  </div>
                )}
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Please save or copy this link now! You will need it to connect with your tutor.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
              {meetingLink && (
                <Button
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(meetingLink);
                    toast({ title: 'Link Copied!', description: 'Meeting link copied to clipboard.' });
                  }}
                  data-testid="button-copy-link-dialog"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link to Clipboard
                </Button>
              )}
              <AlertDialogAction 
                className="w-full" 
                data-testid="button-understand-dialog"
                onClick={() => {
                  setShowMeetingAlert(false);
                  sessionStorage.clear();
                  setLocation('/');
                }}
              >
                I Understand - Go to Home Page
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600" data-testid="text-booking-confirmed">
              Booking Confirmed!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              Your tutoring session has been booked successfully.
            </p>

            {/* Booking Details */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Student: <span className="font-medium">{bookingDetails.studentName}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>Email: <span className="font-medium">{bookingDetails.studentEmail}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Duration: <span className="font-medium">{bookingDetails.hours} hour(s)</span></span>
              </div>
              <div className="flex items-center justify-between text-sm border-t pt-2 mt-2">
                <span className="font-semibold">Amount Paid:</span>
                <span className="font-semibold text-green-600">R{bookingDetails.amount}</span>
              </div>
            </div>

            {/* Tutor Contact Details Section */}
            {tutorDetails && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Tutor's Contact Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium">{tutorDetails.name}</span>
                  </div>
                  {tutorDetails.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <a 
                        href={`mailto:${tutorDetails.email}`}
                        className="text-blue-700 dark:text-blue-300 hover:underline"
                        data-testid="link-tutor-email"
                      >
                        {tutorDetails.email}
                      </a>
                    </div>
                  )}
                  {tutorDetails.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <a 
                        href={`tel:${tutorDetails.phone}`}
                        className="text-blue-700 dark:text-blue-300 hover:underline"
                        data-testid="link-tutor-phone"
                      >
                        {tutorDetails.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Google Meet Link Section */}
            {meetingLink ? (
              <div className="space-y-4">
                <p className="font-medium">Your Google Meet session link:</p>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => window.open(meetingLink, '_blank')}
                  data-testid="button-join-meeting"
                >
                  <Video className="h-5 w-5 mr-2" />
                  Join Google Meet Session
                </Button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  <span className="truncate flex-1">{meetingLink}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(meetingLink);
                      toast({ title: 'Link Copied', description: 'Meeting link copied to clipboard.' });
                    }}
                    data-testid="button-copy-link"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Save this link - you'll need it to join your tutoring session at the scheduled time.
                </p>
              </div>
            ) : (
              <div className="bg-orange-100 dark:bg-orange-950/50 p-4 rounded-lg border-2 border-orange-400">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Please send your proof of payment to <strong>onlinepresenceimpact@gmail.com</strong> including the tutor name and subject. A Google Meet link will be shared with you.
                </p>
              </div>
            )}

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-3">
                Your tutor contact details will be available until your session ends. Please save them now.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  sessionStorage.clear();
                  setLocation('/');
                }}
                data-testid="button-back-home"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Something Went Wrong</CardTitle>
          <CardDescription>
            We couldn't process your booking. Please contact support or try booking again.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={() => setLocation('/')}
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Home Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
