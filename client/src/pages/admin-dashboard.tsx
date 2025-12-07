import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, BookOpen, DollarSign, ShieldCheck, LogOut, 
  CheckCircle, XCircle, Ban, UserCheck, Loader2, AlertCircle,
  Mail, Calendar, Clock
} from 'lucide-react';
import type { TutorProfile, BookingPayment, Pricing } from '@shared/schema';

export default function AdminDashboard() {
  const { isAdmin, adminSignOut, userRole, getAdminToken } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: tutorProfiles = [], isLoading: loadingTutors } = useQuery<TutorProfile[]>({
    queryKey: ['/api/tutor-profiles'],
    enabled: isAdmin,
  });

  const { data: bookings = [], isLoading: loadingBookings } = useQuery<BookingPayment[]>({
    queryKey: ['/api/booking-payments'],
    enabled: isAdmin,
  });

  const { data: pricing = [], isLoading: loadingPricing } = useQuery<Pricing[]>({
    queryKey: ['/api/pricing'],
    enabled: isAdmin,
  });

  const approveTutorMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = getAdminToken();
      const response = await fetch(`/api/tutor-profiles/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'x-admin-token': token } : {}),
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to approve tutor');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Tutor Approved', description: 'The tutor has been approved successfully.' });
      queryClient.invalidateQueries({ queryKey: ['/api/tutor-profiles'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message || 'Failed to approve tutor.', variant: 'destructive' });
    },
  });

  const blockTutorMutation = useMutation({
    mutationFn: async ({ id, blocked }: { id: string; blocked: boolean }) => {
      const token = getAdminToken();
      const response = await fetch(`/api/tutor-profiles/${id}/block`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'x-admin-token': token } : {}),
        },
        body: JSON.stringify({ blocked }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update tutor status');
      }
      return response.json();
    },
    onSuccess: (_, { blocked }) => {
      toast({ 
        title: blocked ? 'Tutor Blocked' : 'Tutor Unblocked', 
        description: `The tutor has been ${blocked ? 'blocked' : 'unblocked'} successfully.` 
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tutor-profiles'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message || 'Failed to update tutor status.', variant: 'destructive' });
    },
  });

  const handleSignOut = () => {
    adminSignOut();
    setLocation('/');
  };

  if (!isAdmin || userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You need admin privileges to access this page.
            </p>
            <Button onClick={() => setLocation('/')} data-testid="button-go-home">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingTutors = tutorProfiles.filter(t => !t.isApproved && !t.isBlocked);
  const approvedTutors = tutorProfiles.filter(t => t.isApproved && !t.isBlocked);
  const blockedTutors = tutorProfiles.filter(t => t.isBlocked);
  const completedBookings = bookings.filter(b => b.paymentStatus === 'completed');
  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold" data-testid="text-admin-title">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage tutors, bookings, and payments</p>
            </div>
          </div>
          
          <Button variant="ghost" onClick={handleSignOut} data-testid="button-admin-signout">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card data-testid="stat-total-tutors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tutors</p>
                  <p className="text-2xl font-bold">{tutorProfiles.length}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card data-testid="stat-pending-approval">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-2xl font-bold">{pendingTutors.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card data-testid="stat-total-bookings">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card data-testid="stat-revenue">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">R{totalRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tutors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="tutors" data-testid="tab-tutors">
              Tutors
              {pendingTutors.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {pendingTutors.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-bookings">Bookings</TabsTrigger>
            <TabsTrigger value="pricing" data-testid="tab-pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="tutors" className="space-y-6">
            {pendingTutors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <Clock className="h-5 w-5" />
                    Pending Approval ({pendingTutors.length})
                  </CardTitle>
                  <CardDescription>
                    Review and approve new tutor applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingTutors ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingTutors.map((tutor) => (
                        <Card key={tutor.id} data-testid={`pending-tutor-${tutor.id}`}>
                          <CardContent className="pt-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="space-y-1">
                                <p className="font-medium">{tutor.fullName}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-4 w-4" />
                                  {tutor.email}
                                </div>
                                {tutor.subjects && tutor.subjects.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {tutor.subjects.map((subject, i) => (
                                      <Badge key={i} variant="secondary">{subject}</Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => approveTutorMutation.mutate(tutor.id)}
                                  disabled={approveTutorMutation.isPending}
                                  data-testid={`button-approve-${tutor.id}`}
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => blockTutorMutation.mutate({ id: tutor.id, blocked: true })}
                                  disabled={blockTutorMutation.isPending}
                                  data-testid={`button-block-${tutor.id}`}
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Block
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Approved Tutors ({approvedTutors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTutors ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : approvedTutors.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No approved tutors yet.</p>
                ) : (
                  <div className="space-y-4">
                    {approvedTutors.map((tutor) => (
                      <Card key={tutor.id} data-testid={`approved-tutor-${tutor.id}`}>
                        <CardContent className="pt-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="space-y-1">
                              <p className="font-medium">{tutor.fullName}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                {tutor.email}
                              </div>
                              {tutor.subjects && tutor.subjects.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {tutor.subjects.map((subject, i) => (
                                    <Badge key={i} variant="secondary">{subject}</Badge>
                                  ))}
                                </div>
                              )}
                              <p className="text-sm">R{tutor.hourlyRate}/hour</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => blockTutorMutation.mutate({ id: tutor.id, blocked: true })}
                              disabled={blockTutorMutation.isPending}
                              data-testid={`button-block-approved-${tutor.id}`}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Block
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {blockedTutors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-5 w-5" />
                    Blocked Tutors ({blockedTutors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blockedTutors.map((tutor) => (
                      <Card key={tutor.id} className="border-destructive/50" data-testid={`blocked-tutor-${tutor.id}`}>
                        <CardContent className="pt-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="space-y-1">
                              <p className="font-medium">{tutor.fullName}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                {tutor.email}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => blockTutorMutation.mutate({ id: tutor.id, blocked: false })}
                              disabled={blockTutorMutation.isPending}
                              data-testid={`button-unblock-${tutor.id}`}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Unblock
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  All Bookings
                </CardTitle>
                <CardDescription>
                  View all tutoring session bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingBookings ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : bookings.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No bookings yet.</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} data-testid={`admin-booking-${booking.id}`}>
                        <CardContent className="pt-4">
                          <div className="grid gap-4 md:grid-cols-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Student</p>
                              <p className="font-medium">{booking.studentName}</p>
                              <p className="text-sm">{booking.studentEmail}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Booking Details</p>
                              <p className="font-medium">{booking.hours} hour(s)</p>
                              <p className="text-sm">R{booking.amount}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge 
                                variant={booking.paymentStatus === 'completed' ? 'default' : 'secondary'}
                                className={booking.paymentStatus === 'completed' ? 'bg-green-600' : ''}
                              >
                                {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Plans
                </CardTitle>
                <CardDescription>
                  View current pricing for tutoring sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPricing ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : pricing.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No pricing configured.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {pricing.map((plan) => (
                      <Card key={plan.id} data-testid={`pricing-plan-${plan.id}`}>
                        <CardContent className="pt-6 text-center">
                          <p className="text-3xl font-bold">R{plan.amount}</p>
                          <p className="text-muted-foreground">{plan.hours} hour(s)</p>
                          <Badge className="mt-2" variant={plan.isActive ? 'default' : 'secondary'}>
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
