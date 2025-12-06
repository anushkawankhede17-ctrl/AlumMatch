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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';

interface AlternateSuggestionModalProps {
  request: MentorshipRequest;
  isOpen: boolean;
  onClose: () => void;
  mode: 'candidate' | 'alumni';
}

export function AlternateSuggestionModal({ request, isOpen, onClose, mode }: AlternateSuggestionModalProps) {
  const { updateRequest } = useApp();
  const [alternateDate, setAlternateDate] = useState('');
  const [alternateTime, setAlternateTime] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!alternateDate || !alternateTime) {
      toast.error('Please select a date and time');
      return;
    }

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    if (mode === 'alumni') {
      updateRequest(request.id, {
        status: 'ALTERNATE_SUGGESTED',
        alternateDate,
        alternateTime,
        alternateNote: note,
      });
      toast.success('Alternate time suggestion sent');
    } else {
      // Candidate suggesting new time after alumni suggested alternate
      updateRequest(request.id, {
        status: 'PENDING',
        proposedDate: alternateDate,
        proposedTime: alternateTime,
        candidateNote: note, // Save candidate's note
        alternateDate: undefined,
        alternateTime: undefined,
        alternateNote: undefined,
      });
      toast.success('New time proposed');
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {mode === 'alumni' ? 'Suggest Alternate Time' : 'Propose New Time'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'alumni' 
              ? 'Propose a different date and time for this session'
              : 'Suggest a new time that works better for you'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="alt-date">New Date</Label>
              <Input
                id="alt-date"
                type="date"
                value={alternateDate}
                onChange={(e) => setAlternateDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt-time">New Time</Label>
              <Input
                id="alt-time"
                type="time"
                value={alternateTime}
                onChange={(e) => setAlternateTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a brief note explaining the change..."
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Sending...' : 'Send Suggestion'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
