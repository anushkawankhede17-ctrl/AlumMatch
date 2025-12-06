import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MentorshipRequest } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PaymentModalProps {
  request: MentorshipRequest;
  alumniName: string;
  hourlyRate: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentModal({ request, alumniName, hourlyRate, isOpen, onClose }: PaymentModalProps) {
  const { updateRequest, addPayment, currentUser } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const sessionCost = (hourlyRate * request.duration) / 60;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success animation
    setIsProcessing(false);
    setShowSuccess(true);

    // Update request and add payment
    updateRequest(request.id, { 
      status: 'PAID',
      paidAt: new Date().toISOString(),
      amount: sessionCost,
    });

    addPayment({
      requestId: request.id,
      candidateId: currentUser!.id,
      alumniId: request.alumniId,
      amount: sessionCost,
      duration: request.duration,
      paidAt: new Date().toISOString(),
    });

    // Close modal after showing success
    setTimeout(() => {
      toast.success('Payment successful! Your session is confirmed.');
      onClose();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="checkmark-circle flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
              <svg className="h-12 w-12" viewBox="0 0 52 52">
                <circle
                  className="stroke-success"
                  cx="26"
                  cy="26"
                  r="23"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  className="checkmark-check stroke-success"
                  fill="none"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 27l7 7 16-16"
                />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">Payment Successful!</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Your session with {alumniName} is now confirmed.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Confirm your session with {alumniName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Summary */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="font-medium">Session Details</h4>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mentor</span>
                <span className="font-medium">{alumniName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{request.proposedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span>{request.proposedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span>{request.duration} minutes</span>
              </div>
              <div className="my-3 border-t border-border" />
              <div className="flex justify-between text-base font-medium">
                <span>Total</span>
                <span>₹{sessionCost.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Mock Payment Notice */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-center text-sm text-muted-foreground">
              This is a mock payment for demonstration purposes.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={isProcessing} className="flex-1">
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Processing...
                </>
              ) : (
                `Pay ₹${sessionCost.toFixed(0)}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
