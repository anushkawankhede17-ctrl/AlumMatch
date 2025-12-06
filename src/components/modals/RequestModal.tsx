import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AlumniMatch } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, Clock, Send } from 'lucide-react';

interface RequestModalProps {
  match: AlumniMatch;
  isOpen: boolean;
  onClose: () => void;
}

export function RequestModal({ match, isOpen, onClose }: RequestModalProps) {
  const { currentUser, createRequest, currentSearchResult } = useApp();
  const { alumni } = match;

  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('');
  const [duration, setDuration] = useState<'30' | '45' | '60'>('30');
  const [emailContent, setEmailContent] = useState(() => generateEmailDraft(match, currentSearchResult, currentUser));
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!proposedDate || !proposedTime) {
      toast.error('Please select a date and time');
      return;
    }

    setIsSending(true);
    
    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    createRequest({
      candidateId: currentUser!.id,
      alumniId: alumni.id,
      status: 'PENDING',
      proposedDate,
      proposedTime,
      duration: parseInt(duration) as 30 | 45 | 60,
      emailContent,
    });

    toast.success('Request sent successfully!');
    setIsSending(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Request to {alumni.name}</DialogTitle>
          <DialogDescription>
            Schedule a mentorship session and send a personalized message
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Scheduling Section */}
          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-4 flex items-center gap-2 font-medium">
              <Calendar className="h-4 w-4" />
              Schedule Your Session
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="date">Proposed Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Proposed Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={duration} onValueChange={(v) => setDuration(v as '30' | '45' | '60')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes - ₹{(alumni.hourlyRate || 3000) / 2}</SelectItem>
                    <SelectItem value="45">45 minutes - ₹{((alumni.hourlyRate || 3000) * 0.75).toFixed(0)}</SelectItem>
                    <SelectItem value="60">60 minutes - ₹{alumni.hourlyRate || 3000}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Email Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Email to {alumni.name}
              </Label>
              <span className="text-xs text-muted-foreground">
                Sent from: AlumMatch on your behalf
              </span>
            </div>
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={12}
              className="resize-none font-mono text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={isSending}>
              {isSending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Request from AlumMatch
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateEmailDraft(match: AlumniMatch, searchResult: any, currentUser: any): string {
  const { alumni } = match;
  const candidate = searchResult?.candidateDetails || currentUser;

  return `Dear ${alumni.name},

I hope this message finds you well. My name is ${candidate?.name || 'a prospective student'}, and I came across your profile on AlumMatch while researching my options for pursuing ${candidate?.degree || 'a graduate degree'} in ${candidate?.targetCountry || 'your country'}.

I was particularly drawn to your profile because of your experience at ${alumni.university} and your current work as ${alumni.currentRole}. Your journey from graduate student to your current position is exactly the kind of path I aspire to follow.

A bit about me: I'm currently based in ${candidate?.currentCity || 'my city'} and am actively preparing for graduate school applications. I'm especially interested in learning about:
- Your experience during the application process
- How you navigated the transition to ${alumni.country}
- Any advice you might have for someone at my stage

I would be grateful for the opportunity to have a ${match.similarityScore > 90 ? 'brief' : ''} conversation with you. I understand your time is valuable, and I'm happy to work around your schedule.

Thank you for considering my request. I look forward to the possibility of learning from your experience.

Best regards,
${candidate?.name || 'Candidate'}

---
This message was sent via AlumMatch. To respond, simply reply to this email or manage the request through your AlumMatch dashboard.`;
}
