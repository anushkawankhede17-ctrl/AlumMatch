import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { UserRole } from '@/types';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCandidate, setIsCandidate] = useState(true);
  const [isAlumni, setIsAlumni] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isCandidate && !isAlumni) {
      toast.error('Please select at least one role');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const roles: UserRole[] = [];
    if (isCandidate) roles.push('candidate');
    if (isAlumni) roles.push('alumni');

    const success = signup(name, email, password, roles);
    
    if (success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error('An account with this email already exists');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="mx-auto w-full max-w-sm px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Create an account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start your mentorship journey with AlumMatch
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-3 pt-2">
            <Label>I want to use AlumMatch as:</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="candidate"
                  checked={isCandidate}
                  onCheckedChange={(checked) => setIsCandidate(!!checked)}
                />
                <div>
                  <Label htmlFor="candidate" className="text-sm font-normal">
                    Candidate (Student)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Find and connect with alumni mentors
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="alumni"
                  checked={isAlumni}
                  onCheckedChange={(checked) => setIsAlumni(!!checked)}
                />
                <div>
                  <Label htmlFor="alumni" className="text-sm font-normal">
                    Alumni (Mentor)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Offer mentorship to students
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
