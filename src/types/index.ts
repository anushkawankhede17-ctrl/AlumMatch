export type UserRole = 'candidate' | 'alumni';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: UserRole[];
  activeRole: UserRole;
  linkedinUrl?: string;
  degree?: string;
  targetCountry?: string;
  currentCity?: string;
  // Alumni-specific fields
  university?: string;
  country?: string;
  currentRole?: string;
  skills?: string[];
  hourlyRate?: number;
  twitterUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  averageRating?: number;
  totalReviews?: number;
}

export type RequestStatus = 
  | 'PENDING' 
  | 'ACCEPTED' 
  | 'REJECTED' 
  | 'ALTERNATE_SUGGESTED' 
  | 'PAID' 
  | 'WITHDRAWN';

export interface MentorshipRequest {
  id: string;
  candidateId: string;
  alumniId: string;
  status: RequestStatus;
  proposedDate: string;
  proposedTime: string;
  duration: 30 | 45 | 60;
  emailContent: string;
  createdAt: string;
  // For rejections
  rejectionReason?: string;
  // For alternate suggestions from alumni
  alternateDate?: string;
  alternateTime?: string;
  alternateNote?: string;
  // For candidate's counter-proposal note
  candidateNote?: string;
  // For payments
  paidAt?: string;
  amount?: number;
  // For reviews
  review?: Review;
}

export interface Review {
  id: string;
  rating: number;
  testimonial: string;
  createdAt: string;
}

export interface AlumniMatch {
  alumni: User;
  similarityScore: number;
  matchReason: string;
}

export interface SearchResult {
  id: string;
  candidateDetails: {
    name: string;
    linkedinUrl: string;
    degree: string;
    currentCountry: string;
    targetCountry: string;
    currentCity: string;
  };
  introText: string;
  matches: AlumniMatch[];
  searchSummary: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  requestId: string;
  candidateId: string;
  alumniId: string;
  amount: number;
  duration: number;
  paidAt: string;
}
