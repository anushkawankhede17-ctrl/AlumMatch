import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react';

export default function AlumniPayments() {
  const { currentUser, isAuthenticated, payments, requests } = useApp();

  if (!isAuthenticated || currentUser?.activeRole !== 'alumni') {
    return <Navigate to="/dashboard" />;
  }

  const alumniPayments = payments.filter(p => p.alumniId === currentUser?.id);
  const totalEarnings = alumniPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalSessions = alumniPayments.length;
  const avgPerSession = totalSessions > 0 ? totalEarnings / totalSessions : 0;

  return (
    <div className="container-page py-8">
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Payments Received</h1>
          <p className="mt-1 text-muted-foreground">Track your earnings from mentorship sessions</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">₹{totalEarnings.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{totalSessions}</p>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <TrendingUp className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">₹{avgPerSession.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">Avg per Session</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All payments received from mentorship sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {alumniPayments.length === 0 ? (
              <div className="py-12 text-center">
                <DollarSign className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="mt-4 text-muted-foreground">No payments received yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Session ID</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alumniPayments.map((payment) => {
                      const request = requests.find(r => r.id === payment.requestId);
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {new Date(payment.paidAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            #{payment.requestId.slice(-6)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {payment.duration} mins
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-success">
                            +₹{payment.amount.toFixed(0)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
