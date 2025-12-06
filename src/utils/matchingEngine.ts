import { User } from '@/types';

interface CandidateInput {
  degree: string;
  currentCountry: string;
  targetCountry: string;
  currentCity?: string; // Optional for more precise matching
  linkedinUrl: string;
}

interface MatchScore {
  alumni: User;
  score: number;
  matchedFeatures: string[];
}

/**
 * Calculate similarity score between candidate and alumni using points-based system
 */
export function calculateAlumniScore(alumni: User, candidateData: CandidateInput): MatchScore {
  let score = 0;
  const matchedFeatures: string[] = [];

  // Extract degree level and field from candidate input
  const candidateDegreeLevel = extractDegreeLevel(candidateData.degree);
  const candidateDegreeField = extractDegreeField(candidateData.degree);
  
  const alumniDegreeLevel = extractDegreeLevel(alumni.degree || '');
  const alumniDegreeField = extractDegreeField(alumni.degree || '');

  // 1. Degree Level Matching (10 points)
  if (candidateDegreeLevel === alumniDegreeLevel) {
    score += 10;
    matchedFeatures.push('same degree level');
  }

  // 2. Degree Field Matching (25 points for exact, 15 for partial)
  if (candidateDegreeField === alumniDegreeField) {
    score += 25;
    matchedFeatures.push(`${candidateDegreeField} specialization`);
  } else if (isRelatedField(candidateDegreeField, alumniDegreeField)) {
    score += 15;
    matchedFeatures.push('related field');
  }

  // 3. Target Country Matching (20 points) - Alumni studied where candidate wants to go
  if (alumni.country === candidateData.targetCountry) {
    score += 20;
    matchedFeatures.push(`studied in ${candidateData.targetCountry}`);
  }

  // 4. Skills Matching - AI/ML/Data Science focus (max 30 points)
  const candidateSkillKeywords = extractSkillKeywords(candidateData.degree);
  if (candidateSkillKeywords.length > 0 && alumni.skills) {
    let skillScore = 0;
    const matchedSkills: string[] = [];
    
    alumni.skills.forEach(skill => {
      if (candidateSkillKeywords.some(keyword => 
        skill.toLowerCase().includes(keyword.toLowerCase())
      )) {
        skillScore += 6;
        matchedSkills.push(skill);
      }
    });
    
    score += Math.min(skillScore, 30);
    if (matchedSkills.length > 0) {
      matchedFeatures.push(`${matchedSkills.length} shared skills (${matchedSkills.slice(0, 2).join(', ')})`);
    }
  }

  // 5. Current Location Matching (Optional - for more precise matches)
  // If candidate is from same country as alumni's current location
  if (candidateData.currentCountry && alumni.currentCity) {
    // Check if alumni is currently in candidate's country (easier to connect)
    const isAlumniInCandidateCountry = isAlumniInCountry(alumni.currentCity, candidateData.currentCountry);
    
    if (isAlumniInCandidateCountry) {
      score += 8;
      matchedFeatures.push(`currently based in ${candidateData.currentCountry}`);
      
      // Extra bonus if same city (when provided)
      if (candidateData.currentCity && alumni.currentCity.toLowerCase() === candidateData.currentCity.toLowerCase()) {
        score += 7;
        matchedFeatures.push(`same city (${candidateData.currentCity})`);
      }
    }
  }

  // 6. University Tier Bonus (15 points for top-tier)
  const topIndianUniversities = [
    'IIT', 'IISc', 'BITS', 'NIT', 'IIIT',
    'Stanford', 'MIT', 'Harvard', 'Oxford', 'Cambridge', 'CMU',
    'UC Berkeley', 'ETH Zurich', 'Imperial College'
  ];
  
  if (topIndianUniversities.some(uni => alumni.university?.includes(uni))) {
    score += 15;
    matchedFeatures.push('top-tier university');
  }

  // 7. Industry Relevance (10 points)
  if (alumni.currentRole && isRelevantRole(alumni.currentRole, candidateDegreeField)) {
    score += 10;
    matchedFeatures.push('relevant industry experience');
  }

  return {
    alumni,
    score: Math.min(score, 100), // Cap at 100
    matchedFeatures
  };
}

/**
 * Get top 3 alumni matches sorted by score
 */
export function getTopMatches(
  allAlumni: User[],
  candidateData: CandidateInput
): MatchScore[] {
  const scoredMatches = allAlumni.map(alumni => 
    calculateAlumniScore(alumni, candidateData)
  );

  // Sort by score descending, then by hourly rate ascending (tie-breaker)
  return scoredMatches
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.alumni.hourlyRate || 0) - (b.alumni.hourlyRate || 0);
    })
    .slice(0, 3);
}

/**
 * Generate match reason text based on matched features
 */
export function generateMatchReason(matchScore: MatchScore): string {
  const { alumni, matchedFeatures } = matchScore;
  
  if (matchedFeatures.length === 0) {
    return `${alumni.name} has valuable experience that aligns with your goals.`;
  }
  
  const featuresText = matchedFeatures.slice(0, 3).join(', ');
  return `Strong match on: ${featuresText}. ${alumni.name} can provide firsthand guidance on your journey.`;
}

// Helper functions

function extractDegreeLevel(degree: string): string {
  const lower = degree.toLowerCase();
  if (lower.includes('phd') || lower.includes('ph.d')) return 'PhD';
  if (lower.includes('mba')) return 'MBA';
  if (lower.includes('ms') || lower.includes('msc') || lower.includes('m.sc') || lower.includes('master')) return 'Masters';
  if (lower.includes('bs') || lower.includes('bsc') || lower.includes('b.sc') || lower.includes('bachelor') || lower.includes('b.tech') || lower.includes('btech') || lower.includes('be') || lower.includes('b.e')) return 'Bachelors';
  return 'Other';
}

function extractDegreeField(degree: string): string {
  const lower = degree.toLowerCase();
  
  // AI/ML/Data Science
  if (lower.includes('artificial intelligence') || lower.includes('ai')) return 'AI';
  if (lower.includes('machine learning') || lower.includes('ml')) return 'ML';
  if (lower.includes('data science') || lower.includes('data analytics')) return 'Data Science';
  
  // Computer Science
  if (lower.includes('computer science') || lower.includes('cs')) return 'Computer Science';
  if (lower.includes('software')) return 'Software Engineering';
  
  // Engineering
  if (lower.includes('electrical') || lower.includes('ece')) return 'Electrical Engineering';
  if (lower.includes('mechanical')) return 'Mechanical Engineering';
  if (lower.includes('civil')) return 'Civil Engineering';
  
  // Business
  if (lower.includes('business') || lower.includes('mba') || lower.includes('management')) return 'Business';
  if (lower.includes('finance')) return 'Finance';
  if (lower.includes('economics')) return 'Economics';
  
  return 'General';
}

function isRelatedField(field1: string, field2: string): boolean {
  const relatedGroups = [
    ['AI', 'ML', 'Data Science', 'Computer Science', 'Software Engineering'],
    ['Business', 'Finance', 'Economics', 'Management'],
    ['Electrical Engineering', 'Computer Science', 'Software Engineering'],
  ];
  
  return relatedGroups.some(group => 
    group.includes(field1) && group.includes(field2)
  );
}

function extractSkillKeywords(degree: string): string[] {
  const keywords: string[] = [];
  const lower = degree.toLowerCase();
  
  if (lower.includes('ai') || lower.includes('artificial intelligence')) {
    keywords.push('AI', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision');
  }
  if (lower.includes('machine learning') || lower.includes('ml')) {
    keywords.push('Machine Learning', 'Python', 'TensorFlow', 'PyTorch', 'Deep Learning');
  }
  if (lower.includes('data science') || lower.includes('data analytics')) {
    keywords.push('Data Science', 'Python', 'SQL', 'Statistics', 'Machine Learning');
  }
  if (lower.includes('computer science') || lower.includes('cs') || lower.includes('software')) {
    keywords.push('Programming', 'Python', 'Java', 'System Design', 'Algorithms');
  }
  
  return keywords;
}

function isRelevantRole(role: string, degreeField: string): boolean {
  const roleLower = role.toLowerCase();
  const fieldLower = degreeField.toLowerCase();
  
  // AI/ML/DS roles
  if ((fieldLower.includes('ai') || fieldLower.includes('ml') || fieldLower.includes('data')) &&
      (roleLower.includes('engineer') || roleLower.includes('scientist') || roleLower.includes('researcher') || 
       roleLower.includes('ai') || roleLower.includes('ml') || roleLower.includes('data'))) {
    return true;
  }
  
  // Software/CS roles
  if (fieldLower.includes('computer') || fieldLower.includes('software')) {
    if (roleLower.includes('engineer') || roleLower.includes('developer') || roleLower.includes('architect')) {
      return true;
    }
  }
  
  // Business roles
  if (fieldLower.includes('business') || fieldLower.includes('finance')) {
    if (roleLower.includes('manager') || roleLower.includes('consultant') || roleLower.includes('analyst')) {
      return true;
    }
  }
  
  return false;
}

function isAlumniInCountry(alumniCity: string, candidateCountry: string): boolean {
  // Map cities to countries
  const indianCities = ['mumbai', 'pune', 'bengaluru', 'bangalore', 'delhi', 'hyderabad', 'chennai', 'kolkata', 'ahmedabad', 'jaipur'];
  const usCities = ['san francisco', 'new york', 'boston', 'seattle', 'palo alto', 'austin', 'chicago'];
  const ukCities = ['london', 'manchester', 'cambridge', 'oxford', 'edinburgh'];
  const canadianCities = ['toronto', 'vancouver', 'montreal', 'ottawa'];
  const germanCities = ['berlin', 'munich', 'frankfurt', 'hamburg'];
  const australianCities = ['sydney', 'melbourne', 'brisbane', 'perth'];
  const singaporeCities = ['singapore'];
  
  const cityLower = alumniCity.toLowerCase();
  const countryLower = candidateCountry.toLowerCase();
  
  if (countryLower === 'india' && indianCities.some(city => cityLower.includes(city))) return true;
  if (countryLower === 'usa' && usCities.some(city => cityLower.includes(city))) return true;
  if (countryLower === 'uk' && ukCities.some(city => cityLower.includes(city))) return true;
  if (countryLower === 'canada' && canadianCities.some(city => cityLower.includes(city))) return true;
  if (countryLower === 'germany' && germanCities.some(city => cityLower.includes(city))) return true;
  if (countryLower === 'australia' && australianCities.some(city => cityLower.includes(city))) return true;
  if (countryLower === 'singapore' && singaporeCities.some(city => cityLower.includes(city))) return true;
  
  return false;
}
