import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, XCircle, AlertCircle, CreditCard, Star, MessageSquare } from 'lucide-react';
import { MentorshipRequest, RequestStatus } from '@/types';
import { PaymentModal } from '@/components/modals/PaymentModal';
import { ReviewModal } from '@/components/modals/ReviewModal';
import { AlternateSuggestionModal } from '@/components/modals/AlternateSuggestionModal';

export default function CandidateRequests() {
  const { currentUser, isAuthenticated, requests, allAlumni, updateRequest } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest | null>(null);
  const [modalType, setModalType] = useState<'payment' | 'review' | 'alternate' | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  const candidateRequests = requests.filter(r => r.candidateId === currentUser?.id);
  
  const pendingRequests = candidateRequests.filter(r => r.status === 'PENDING');
  const acceptedRequests = candidateRequests.filter(r => r.status === 'ACCEPTED');
  const alternateRequests = candidateRequests.filter(r => r.status === 'ALTERNATE_SUGGESTED');
  const paidRequests = candidateRequests.filter(r => r.status === 'PAID');
  const rejectedRequests = candidateRequests.filter(r => r.status === 'REJECTED');
  const withdrawnRequests = candidateRequests.filter(r => r.status === 'WITHDRAWN');

  const getAlumniName = (alumniId: string) => {
    return allAlumni.find(a => a.id === alumniId)?.name || 'Unknown Alumni';
  };

  const getAlumniRate = (alumniId: string) => {
    return allAlumni.find(a => a.id === alumniId)?.hourlyRate || 100;
  };

  const handleWithdraw = (request: MentorshipRequest) => {
    updateRequest(request.id, { status: 'WITHDRAWN' });
  };

  const handleAcceptAlternate = (request: MentorshipRequest) => {
    updateRequest(request.id, { 
      status: 'ACCEPTED',
      proposedDate: request.alternateDate,
      proposedTime: request.alternateTime,
    });
  };

  const openModal = (request: MentorshipRequest, type: 'payment' | 'review' | 'alternate') => {
    setSelectedRequest(request);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setModalType(null);
  };

  const renderStatusBadge = (status: RequestStatus) => {
    const config: Record<RequestStatus, { class: string; icon: any; label: string }> = {
      PENDING: { class: 'badge-pending', icon: Clock, label: 'Pending' },
      ACCEPTED: { class: 'badge-accepted', icon: CheckCircle, label: 'Accepted' },
      REJECTED: { class: 'badge-rejected', icon: XCircle, label: 'Rejected' },
      ALTERNATE_SUGGESTED: { class: 'badge-alternate', icon: AlertCircle, label: 'Alternate Suggested' },
      PAID: { class: 'badge-paid', icon: CreditCard, label: 'Paid' },
      WITHDRAWN: { class: 'badge-rejected', icon: XCircle, label: 'Withdrawn' },
    };
    const { class: className, icon: Icon, label } = config[status];
    return (
      <Badge className={className}>
        <Icon className="mr-1 h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const RequestCard = ({ request }: { request: MentorshipRequest }) => {
    const hourlyRate = getAlumniRate(request.alumniId);
    const sessionCost = (hourlyRate * request.duration) / 60;

    return (
      <Card className="transition-shadow hover:shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{getAlumniName(request.alumniId)}</h3>
                {renderStatusBadge(request.status)}
              </div>
              <p className="text-sm text-muted-foreground">
                {request.proposedDate} at {request.proposedTime} • {request.duration} mins • ₹{sessionCost}
              </p>
              <p className="text-xs text-muted-foreground">
                Requested on {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {request.status === 'PENDING' && (
                <Button variant="outline" size="sm" onClick={() => handleWithdraw(request)}>
                  Withdraw
                </Button>
              )}
              {request.status === 'ACCEPTED' && (
                <Button size="sm" onClick={() => openModal(request, 'payment')}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now
                </Button>
              )}
              {request.status === 'ALTERNATE_SUGGESTED' && (
                <>
                  <Button size="sm" onClick={() => handleAcceptAlternate(request)}>
                    Accept Alternate
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openModal(request, 'alternate')}>
                    Suggest Another
                  </Button>
                </>
              )}
              {request.status === 'PAID' && !request.review && (
                <Button variant="outline" size="sm" onClick={() => openModal(request, 'review')}>
                  <Star className="mr-2 h-4 w-4" />
                  Leave Review
                </Button>
              )}
            </div>
          </div>

          {/* Status-specific content */}
          {request.status === 'REJECTED' && request.rejectionReason && (
            <div className="mt-4 rounded-lg bg-destructive/5 p-3">
              <p className="text-sm text-muted-foreground">
                <strong>Reason:</strong> {request.rejectionReason}
              </p>
            </div>
          )}

          {request.status === 'ALTERNATE_SUGGESTED' && (
            <div className="mt-4 rounded-lg bg-muted p-3">
              <p className="text-sm font-medium">Alumni suggested a new time:</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {request.alternateDate} at {request.alternateTime}
              </p>
              {request.alternateNote && (
                <p className="mt-2 text-sm text-muted-foreground italic">
                  "{request.alternateNote}"
                </p>
              )}
            </div>
          )}

          {request.status === 'PAID' && request.review && (
            <div className="mt-4 rounded-lg bg-primary/5 p-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < request.review!.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{request.review.testimonial}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container-page py-8">
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Requests</h1>
          <p className="mt-1 text-muted-foreground">Track your mentorship requests and past sessions</p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">
              Active ({pendingRequests.length + acceptedRequests.length + alternateRequests.length})
            </TabsTrigger>
            <TabsTrigger value="completed">Completed ({paidRequests.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({rejectedRequests.length + withdrawnRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {[...pendingRequests, ...acceptedRequests, ...alternateRequests].length === 0 ? (
              <EmptyState message="No active requests" />
            ) : (
              [...pendingRequests, ...acceptedRequests, ...alternateRequests].map(req => (
                <RequestCard key={req.id} request={req} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {paidRequests.length === 0 ? (
              <EmptyState message="No completed sessions yet" />
            ) : (
              paidRequests.map(req => <RequestCard key={req.id} request={req} />)
            )}
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            {[...rejectedRequests, ...withdrawnRequests].length === 0 ? (
              <EmptyState message="No closed requests" />
            ) : (
              [...rejectedRequests, ...withdrawnRequests].map(req => (
                <RequestCard key={req.id} request={req} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedRequest && modalType === 'payment' && (
        <PaymentModal
          request={selectedRequest}
          alumniName={getAlumniName(selectedRequest.alumniId)}
          hourlyRate={getAlumniRate(selectedRequest.alumniId)}
          isOpen={true}
          onClose={closeModal}
        />
      )}

      {selectedRequest && modalType === 'review' && (
        <ReviewModal
          request={selectedRequest}
          alumniName={getAlumniName(selectedRequest.alumniId)}
          isOpen={true}
          onClose={closeModal}
        />
      )}

      {selectedRequest && modalType === 'alternate' && (
        <AlternateSuggestionModal
          request={selectedRequest}
          isOpen={true}
          onClose={closeModal}
          mode="candidate"
        />
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
