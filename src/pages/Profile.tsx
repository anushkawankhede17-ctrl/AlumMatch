import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { currentUser, isAuthenticated, updateUser, payments, requests } = useApp();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  const candidatePayments = payments.filter(p => p.candidateId === currentUser?.id);

  const handleSaveCard = () => {
    if (!cardNumber || !expiry || !cvv) {
      toast.error('Please fill in all card details');
      return;
    }
    toast.success('Card saved successfully (mock)');
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  return (
    <div className="container-page py-8">
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          <p className="mt-1 text-muted-foreground">Manage your account and payment methods</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              Payment History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={currentUser?.name} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={currentUser?.email} readOnly className="bg-muted" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Roles</Label>
                  <div className="flex gap-2">
                    {currentUser?.roles.map(role => (
                      <span 
                        key={role}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium capitalize text-primary"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Account created for demonstration purposes.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Add a payment method for mentorship sessions (mock)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="card">Card Number</Label>
                    <Input
                      id="card"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input
                        id="expiry"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        type="password"
                      />
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">
                    This is a mock payment form for demonstration. No real payment processing occurs.
                  </p>
                </div>
                <Button onClick={handleSaveCard}>Save Card</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your past session payments</CardDescription>
              </CardHeader>
              <CardContent>
                {candidatePayments.length === 0 ? (
                  <div className="py-12 text-center">
                    <DollarSign className="mx-auto h-12 w-12 text-muted-foreground/40" />
                    <p className="mt-4 text-muted-foreground">No payments yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {candidatePayments.map((payment) => (
                      <div 
                        key={payment.id}
                        className="flex items-center justify-between rounded-lg border border-border p-4"
                      >
                        <div>
                          <p className="font-medium">Session #{payment.requestId.slice(-6)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.paidAt).toLocaleDateString()} • {payment.duration} mins
                          </p>
                        </div>
                        <p className="font-semibold">₹{payment.amount.toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
