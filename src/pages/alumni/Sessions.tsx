import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, Star, MessageSquare } from 'lucide-react';

export default function AlumniSessions() {
  const { currentUser, isAuthenticated, requests, payments } = useApp();

  if (!isAuthenticated || currentUser?.activeRole !== 'alumni') {
    return <Navigate to="/dashboard" />;
  }

  const completedSessions = requests.filter(
    r => r.alumniId === currentUser?.id && r.status === 'PAID'
  );

  const alumniPayments = payments.filter(p => p.alumniId === currentUser?.id);

  return (
    <div className="container-page py-8">
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Past Sessions</h1>
          <p className="mt-1 text-muted-foreground">View your completed mentorship sessions and reviews</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{completedSessions.length}</p>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">
                    ₹{alumniPayments.reduce((sum, p) => sum + p.amount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Star className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{currentUser?.averageRating?.toFixed(1) || '—'}</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        {completedSessions.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Calendar className="mx-auto h-16 w-16 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No completed sessions yet</h3>
              <p className="mt-2 text-muted-foreground">
                Your completed mentorship sessions will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {completedSessions.map((session) => {
              const payment = alumniPayments.find(p => p.requestId === session.id);
              return (
                <Card key={session.id} className="transition-shadow hover:shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">Session #{session.id.slice(-6)}</h3>
                          <Badge className="badge-paid">Completed</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {session.proposedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.proposedTime} • {session.duration} mins
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ₹{payment?.amount.toFixed(0) || '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review Section */}
                    {session.review ? (
                      <div className="mt-4 rounded-lg bg-primary/5 p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < session.review!.rating
                                    ? 'fill-warning text-warning'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(session.review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-foreground">{session.review.testimonial}</p>
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>Awaiting candidate review</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
