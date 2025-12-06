import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Inbox, Clock, Check, X, Calendar, ExternalLink } from 'lucide-react';
import { MentorshipRequest } from '@/types';
import { RejectModal } from '@/components/modals/RejectModal';
import { AlternateSuggestionModal } from '@/components/modals/AlternateSuggestionModal';
import { toast } from 'sonner';

export default function AlumniRequests() {
  const { currentUser, isAuthenticated, requests, updateRequest } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest | null>(null);
  const [modalType, setModalType] = useState<'reject' | 'alternate' | null>(null);

  if (!isAuthenticated || currentUser?.activeRole !== 'alumni') {
    return <Navigate to="/dashboard" />;
  }

  const incomingRequests = requests.filter(
    r => r.alumniId === currentUser?.id && r.status === 'PENDING'
  );

  const handleAccept = (request: MentorshipRequest) => {
    updateRequest(request.id, { status: 'ACCEPTED' });
    toast.success('Request accepted! Candidate can now proceed with payment.');
  };

  const openModal = (request: MentorshipRequest, type: 'reject' | 'alternate') => {
    setSelectedRequest(request);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setModalType(null);
  };

  if (incomingRequests.length === 0) {
    return (
      <div className="container-page py-8">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold text-foreground">Incoming Requests</h1>
          <p className="mt-1 text-muted-foreground">Manage mentorship requests from candidates</p>

          <Card className="mt-8">
            <CardContent className="py-16 text-center">
              <Inbox className="mx-auto h-16 w-16 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No pending requests</h3>
              <p className="mt-2 text-muted-foreground">
                When candidates send you mentorship requests, they'll appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Incoming Requests</h1>
          <p className="mt-1 text-muted-foreground">
            You have {incomingRequests.length} pending request{incomingRequests.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-4">
          {incomingRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onAccept={() => handleAccept(request)}
              onReject={() => openModal(request, 'reject')}
              onSuggestAlternate={() => openModal(request, 'alternate')}
            />
          ))}
        </div>
      </div>

      {selectedRequest && modalType === 'reject' && (
        <RejectModal
          request={selectedRequest}
          isOpen={true}
          onClose={closeModal}
        />
      )}

      {selectedRequest && modalType === 'alternate' && (
        <AlternateSuggestionModal
          request={selectedRequest}
          isOpen={true}
          onClose={closeModal}
          mode="alumni"
        />
      )}
    </div>
  );
}

interface RequestCardProps {
  request: MentorshipRequest;
  onAccept: () => void;
  onReject: () => void;
  onSuggestAlternate: () => void;
}

function RequestCard({ request, onAccept, onReject, onSuggestAlternate }: RequestCardProps) {
  const { allAlumni } = useApp();
  const alumni = allAlumni.find(a => a.id === request.alumniId);
  const sessionCost = alumni ? (alumni.hourlyRate! * request.duration) / 60 : 0;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Left: Request Info */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Request #{request.id.slice(-6)}</h3>
                  <Badge className="badge-pending">
                    <Clock className="mr-1 h-3 w-3" />
                    Pending
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Received on {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">₹{sessionCost.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">{request.duration} mins</p>
              </div>
            </div>

            {/* Session Details */}
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{request.proposedDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{request.proposedTime}</span>
              </div>
            </div>

            {/* Email Preview */}
            <div className="mt-4 rounded-lg bg-muted/50 p-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Message from candidate:</p>
              <p className="line-clamp-4 text-sm text-muted-foreground">
                {request.emailContent.slice(0, 300)}...
              </p>
            </div>

            {/* Candidate's Note (when they counter-propose) */}
            {request.candidateNote && (
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="mb-2 text-xs font-medium text-foreground">Candidate's note about the proposed time:</p>
                <p className="text-sm text-muted-foreground italic">
                  "{request.candidateNote}"
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={onAccept} className="gap-2">
                <Check className="h-4 w-4" />
                Accept
              </Button>
              <Button variant="outline" onClick={onSuggestAlternate} className="gap-2">
                <Calendar className="h-4 w-4" />
                Suggest Alternate Time
              </Button>
              <Button variant="outline" onClick={onReject} className="gap-2 text-destructive hover:bg-destructive/10">
                <X className="h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
