import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Clock, ArrowRight } from 'lucide-react';
import { SearchResult, AlumniMatch } from '@/types';
import { toast } from 'sonner';
import { getTopMatches, generateMatchReason } from '@/utils/matchingEngine';

const countries = ['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Singapore', 'India'];
const degrees = [
  'MS Computer Science',
  'MS Artificial Intelligence',
  'MS Data Science',
  'MS Machine Learning',
  'MBA',
  'PhD Computer Science',
  'B.Tech Computer Science',
  'B.E Computer Science',
  'MS Engineering'
];

export function CandidateDashboard() {
  const { currentUser, allAlumni, searchResults, addSearchResult, requests } = useApp();
  const navigate = useNavigate();
  
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    linkedinUrl: currentUser?.linkedinUrl || '',
    degree: '',
    currentCountry: 'India',
    targetCountry: '',
    currentCity: '',
  });

  const candidateRequests = requests.filter(r => r.candidateId === currentUser?.id);
  const candidateSearches = searchResults.filter(s => 
    s.candidateDetails.name === currentUser?.name
  );

  const handleSearch = async () => {
    if (!formData.linkedinUrl || !formData.degree || !formData.currentCountry || !formData.targetCountry) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSearching(true);

    // Simulate AI matching delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Use advanced points-based matching engine
    const topMatches = getTopMatches(allAlumni, {
      degree: formData.degree,
      currentCountry: formData.currentCountry,
      targetCountry: formData.targetCountry,
      currentCity: formData.currentCity,
      linkedinUrl: formData.linkedinUrl,
    });

    const matchedAlumni = topMatches.map((match): AlumniMatch => ({
      alumni: match.alumni,
      similarityScore: match.score,
      matchReason: generateMatchReason(match),
    }));

    const searchResult: SearchResult = {
      id: `search-${Date.now()}`,
      candidateDetails: {
        name: formData.name,
        linkedinUrl: formData.linkedinUrl,
        degree: formData.degree,
        currentCountry: formData.currentCountry,
        targetCountry: formData.targetCountry,
        currentCity: formData.currentCity,
      },
      introText: `Based on your background in ${formData.currentCountry} and aspirations to pursue ${formData.degree} in ${formData.targetCountry}, we've found three alumni who've walked a similar path and can offer invaluable guidance for your journey.`,
      matches: matchedAlumni,
      searchSummary: `Found ${matchedAlumni.length} alumni matches from ${formData.currentCountry} for ${formData.degree} in ${formData.targetCountry}`,
      createdAt: new Date().toISOString(),
    };

    addSearchResult(searchResult);
    setIsSearching(false);
    navigate('/candidate/results');
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Find your perfect alumni mentor</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Start a New Match */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Start a New Match
            </CardTitle>
            <CardDescription>
              Tell us about yourself to find alumni who match your goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL *</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Intended Degree *</Label>
                <Select value={formData.degree} onValueChange={(v) => setFormData({ ...formData, degree: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    {degrees.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Current Country *</Label>
                  <Select value={formData.currentCountry} onValueChange={(v) => setFormData({ ...formData, currentCountry: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Where are you now?" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Country *</Label>
                  <Select value={formData.targetCountry} onValueChange={(v) => setFormData({ ...formData, targetCountry: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Where do you want to study?" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Current City <span className="text-muted-foreground text-xs">(optional - for more precise matches)</span></Label>
                <Input
                  id="city"
                  value={formData.currentCity}
                  onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                  placeholder="e.g., Mumbai, Pune, Bengaluru"
                />
              </div>
            </div>

            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="w-full sm:w-auto"
            >
              {isSearching ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Matching you with alumni...
                </>
              ) : (
                <>
                  Find my 3 best alumni
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{candidateSearches.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                {candidateRequests.filter(r => r.status === 'PENDING' || r.status === 'ACCEPTED').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                {candidateRequests.filter(r => r.status === 'PAID').length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Previous Searches */}
      {candidateSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Previous Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidateSearches.slice(0, 5).map((search) => (
                <div 
                  key={search.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {search.candidateDetails.degree} in {search.candidateDetails.targetCountry}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Top match: {search.matches[0]?.alumni.name} ({search.matches[0]?.similarityScore}% match)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(search.createdAt).toLocaleDateString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1"
                      onClick={() => {
                        // Set the current search result and navigate
                        navigate('/candidate/results');
                      }}
                    >
                      View results
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
