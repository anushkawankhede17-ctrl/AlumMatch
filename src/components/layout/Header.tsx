import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, User, LogOut, RefreshCw } from 'lucide-react';

export function Header() {
  const { currentUser, isAuthenticated, logout, switchRole } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">A</span>
            </div>
            <span className="text-lg font-semibold text-foreground">AlumMatch</span>
          </Link>

          <nav className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                
                {currentUser?.activeRole === 'candidate' ? (
                  <Link 
                    to="/candidate/requests" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    My Requests
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/alumni/requests" 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Requests
                    </Link>
                    <Link 
                      to="/alumni/sessions" 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Sessions
                    </Link>
                    <Link 
                      to="/alumni/payments" 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Payments
                    </Link>
                  </>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span>{currentUser?.name}</span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-xs capitalize">
                        {currentUser?.activeRole}
                      </span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {currentUser?.roles.length === 2 && (
                      <>
                        <DropdownMenuItem 
                          onClick={() => switchRole(currentUser.activeRole === 'candidate' ? 'alumni' : 'candidate')}
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Switch to {currentUser.activeRole === 'candidate' ? 'Alumni' : 'Candidate'} Mode
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive">
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link 
                  to="/auth/login" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Button asChild size="sm">
                  <Link to="/auth/signup">Sign up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
