import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, MentorshipRequest, SearchResult, Payment } from '@/types';
import { mockAlumni } from '@/data/mockAlumni';

interface AppContextType {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, roles: UserRole[]) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Alumni data
  allAlumni: User[];
  
  // Search results
  searchResults: SearchResult[];
  addSearchResult: (result: SearchResult) => void;
  currentSearchResult: SearchResult | null;
  setCurrentSearchResult: (result: SearchResult | null) => void;
  
  // Requests
  requests: MentorshipRequest[];
  createRequest: (request: Omit<MentorshipRequest, 'id' | 'createdAt'>) => void;
  updateRequest: (id: string, updates: Partial<MentorshipRequest>) => void;
  
  // Payments
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('alumatch_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [allAlumni] = useState<User[]>(mockAlumni);
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>(() => {
    const saved = localStorage.getItem('alumatch_searches');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSearchResult, setCurrentSearchResult] = useState<SearchResult | null>(null);
  
  const [requests, setRequests] = useState<MentorshipRequest[]>(() => {
    const saved = localStorage.getItem('alumatch_requests');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('alumatch_payments');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('alumatch_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('alumatch_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('alumatch_searches', JSON.stringify(searchResults));
  }, [searchResults]);

  useEffect(() => {
    localStorage.setItem('alumatch_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('alumatch_payments', JSON.stringify(payments));
  }, [payments]);

  const login = (email: string, password: string): boolean => {
    // Check mock alumni first
    const alumni = allAlumni.find(a => a.email === email && a.password === password);
    if (alumni) {
      setCurrentUser(alumni);
      return true;
    }
    
    // Check stored users
    const storedUsers = JSON.parse(localStorage.getItem('alumatch_users') || '[]');
    const user = storedUsers.find((u: User) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    
    return false;
  };

  const signup = (name: string, email: string, password: string, roles: UserRole[]): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('alumatch_users') || '[]');
    
    if (storedUsers.some((u: User) => u.email === email)) {
      return false;
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      roles,
      activeRole: roles[0],
    };
    
    storedUsers.push(newUser);
    localStorage.setItem('alumatch_users', JSON.stringify(storedUsers));
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (currentUser && currentUser.roles.includes(role)) {
      setCurrentUser({ ...currentUser, activeRole: role });
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (currentUser) {
      const updated = { ...currentUser, ...updates };
      setCurrentUser(updated);
      
      // Also update in stored users
      const storedUsers = JSON.parse(localStorage.getItem('alumatch_users') || '[]');
      const index = storedUsers.findIndex((u: User) => u.id === currentUser.id);
      if (index >= 0) {
        storedUsers[index] = updated;
        localStorage.setItem('alumatch_users', JSON.stringify(storedUsers));
      }
    }
  };

  const addSearchResult = (result: SearchResult) => {
    setSearchResults(prev => [result, ...prev]);
    setCurrentSearchResult(result);
  };

  const createRequest = (request: Omit<MentorshipRequest, 'id' | 'createdAt'>) => {
    const newRequest: MentorshipRequest = {
      ...request,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const updateRequest = (id: string, updates: Partial<MentorshipRequest>) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, ...updates } : req
    ));
  };

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...payment,
      id: `pay-${Date.now()}`,
    };
    setPayments(prev => [...prev, newPayment]);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      signup,
      logout,
      switchRole,
      updateUser,
      allAlumni,
      searchResults,
      addSearchResult,
      currentSearchResult,
      setCurrentSearchResult,
      requests,
      createRequest,
      updateRequest,
      payments,
      addPayment,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
