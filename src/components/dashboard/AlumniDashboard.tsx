import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Inbox, Calendar, DollarSign, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AlumniDashboard() {
  const { currentUser, requests, payments } = useApp();

  const incomingRequests = requests.filter(r => r.alumniId === currentUser?.id);
  const pendingRequests = incomingRequests.filter(r => r.status === 'PENDING');
  const completedSessions = incomingRequests.filter(r => r.status === 'PAID');
  const alumniPayments = payments.filter(p => p.alumniId === currentUser?.id);
  const totalEarnings = alumniPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Alumni Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Manage your mentorship sessions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{pendingRequests.length}</p>
            <Link to="/alumni/requests" className="text-sm text-primary hover:underline">
              View requests →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{completedSessions.length}</p>
            <Link to="/alumni/sessions" className="text-sm text-primary hover:underline">
              View sessions →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">₹{totalEarnings}</p>
            <Link to="/alumni/payments" className="text-sm text-primary hover:underline">
              View payments →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {currentUser?.averageRating?.toFixed(1) || '—'}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentUser?.totalReviews || 0} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>Your latest incoming mentorship requests</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="py-8 text-center">
              <Inbox className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No pending requests</p>
              <p className="text-sm text-muted-foreground">
                New requests from candidates will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.slice(0, 3).map((request) => (
                <div 
                  key={request.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium">Request #{request.id.slice(-6)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {request.proposedDate} at {request.proposedTime} • {request.duration} mins
                    </p>
                  </div>
                  <Badge className="badge-pending">Pending</Badge>
                </div>
              ))}
              {pendingRequests.length > 3 && (
                <Link 
                  to="/alumni/requests" 
                  className="block text-center text-sm text-primary hover:underline"
                >
                  View all {pendingRequests.length} requests →
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
