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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { XCircle } from 'lucide-react';

interface RejectModalProps {
  request: MentorshipRequest;
  isOpen: boolean;
  onClose: () => void;
}

const rejectionSuggestions = [
  'Unavailable during this period.',
  'Not offering mentorship currently.',
  'Schedule is fully booked.',
  'Taking a break from mentoring.',
];

export function RejectModal({ request, isOpen, onClose }: RejectModalProps) {
  const { updateRequest } = useApp();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    updateRequest(request.id, {
      status: 'REJECTED',
      rejectionReason: reason,
    });

    toast.success('Request rejected');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Reject Request
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this mentorship request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quick Suggestions */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Quick responses:</Label>
            <div className="flex flex-wrap gap-2">
              {rejectionSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setReason(suggestion)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Text */}
          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you're rejecting this request..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              This message will be shared with the candidate.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleSubmit} 
              disabled={isSubmitting} 
              className="flex-1"
            >
              {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
