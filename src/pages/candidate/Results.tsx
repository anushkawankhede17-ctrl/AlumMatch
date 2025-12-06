import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink, Linkedin, Twitter, Globe, Mail } from 'lucide-react';
import { AlumniMatch } from '@/types';
import { RequestModal } from '@/components/modals/RequestModal';

export default function Results() {
  const { currentUser, isAuthenticated, currentSearchResult, requests } = useApp();
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniMatch | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (!currentSearchResult) {
    return <Navigate to="/dashboard" />;
  }

  const hasRequestedAlumni = (alumniId: string) => {
    return requests.some(
      r => r.candidateId === currentUser?.id && 
           r.alumniId === alumniId && 
           r.status !== 'WITHDRAWN' && 
           r.status !== 'REJECTED'
    );
  };

  return (
    <div className="container-page py-8">
      <div className="animate-fade-in space-y-8">
        {/* Intro Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <p className="text-lg text-foreground">{currentSearchResult.introText}</p>
            <p className="mt-2 text-sm text-muted-foreground">{currentSearchResult.searchSummary}</p>
          </CardContent>
        </Card>

        {/* Alumni Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {currentSearchResult.matches.map((match, index) => (
            <AlumniCard
              key={match.alumni.id}
              match={match}
              rank={index + 1}
              hasRequested={hasRequestedAlumni(match.alumni.id)}
              onSendRequest={() => setSelectedAlumni(match)}
            />
          ))}
        </div>
      </div>

      {selectedAlumni && (
        <RequestModal
          match={selectedAlumni}
          isOpen={!!selectedAlumni}
          onClose={() => setSelectedAlumni(null)}
        />
      )}
    </div>
  );
}

interface AlumniCardProps {
  match: AlumniMatch;
  rank: number;
  hasRequested: boolean;
  onSendRequest: () => void;
}

function AlumniCard({ match, rank, hasRequested, onSendRequest }: AlumniCardProps) {
  const { alumni, similarityScore, matchReason } = match;

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-medium">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-lg font-semibold text-primary">
                {alumni.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg">{alumni.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{alumni.currentRole}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">#{rank}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-4">
        {/* Score & Match Reason */}
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Match Score</span>
            <span className="text-lg font-semibold text-primary">{similarityScore}%</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{matchReason}</p>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Degree:</span>{' '}
            <span className="font-medium">{alumni.degree}</span>
          </p>
          <p>
            <span className="text-muted-foreground">University:</span>{' '}
            <span className="font-medium">{alumni.university}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Location:</span>{' '}
            <span className="font-medium">{alumni.currentCity}, {alumni.country}</span>
          </p>
        </div>

        {/* Skills */}
        {alumni.skills && (
          <div className="flex flex-wrap gap-1.5">
            {alumni.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {/* Rating & Price */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-medium">{alumni.averageRating?.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({alumni.totalReviews} reviews)
            </span>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">₹{alumni.hourlyRate}</p>
            <p className="text-xs text-muted-foreground">per hour</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-2">
          {alumni.linkedinUrl && (
            <a 
              href={alumni.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {alumni.twitterUrl && (
            <a 
              href={alumni.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {alumni.portfolioUrl && (
            <a 
              href={alumni.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span>Verified email</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-2">
          <Button 
            className="flex-1"
            disabled={hasRequested}
            onClick={onSendRequest}
          >
            {hasRequested ? 'Request Sent' : 'Send Request'}
          </Button>
          <Button 
            variant="outline" 
            disabled={!hasRequested}
            className="flex-1"
          >
            Pay Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
