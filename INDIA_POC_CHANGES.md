# AlumMatch - India POC Implementation

## Overview
AlumMatch has been transformed into an **India-focused mentorship platform** connecting Indian students with alumni who have successfully pursued higher education abroad.

## 🇮🇳 Key Changes Implemented

### 1. **India-Based Alumni Dataset**
Created 12 diverse alumni profiles based on real LinkedIn profiles and Indian context:

#### Real Profiles Used:
- **Vivek Kalmorge** - Stanford CS, Google (Pune)
- **Sankalp Jadhav** - CMU AI, Microsoft Research (Mumbai)
- **Sugam Dange** - MIT Data Science, Amazon (Bengaluru)
- **Atharva Patil** - Georgia Tech CS, Meta (Pune)
- **Anushka Wankhede** - UC Berkeley DS, Netflix (Mumbai)

#### Additional Profiles:
- Rohan Deshmukh - CMU ML, Tesla (Hyderabad)
- Priya Kulkarni - Stanford AI, OpenAI (Bengaluru)
- Aditya Sharma - IIT Bombay, Flipkart (Mumbai)
- Neha Joshi - BITS Pilani, Microsoft India (Pune)
- Karan Mehta - IIT Kharagpur, Qualcomm (Bengaluru)
- Ishita Verma - IISc PhD, NCBS (Bengaluru)
- Rahul Nair - NIT Karnataka, Tata Motors (Chennai)

**Key Attributes:**
- Indian cities (Mumbai, Pune, Bengaluru, Hyderabad, Chennai)
- Mix of US universities (Stanford, MIT, CMU, Berkeley) and Indian institutions (IITs, BITS, IISc, NITs)
- Tech-focused roles at FAANG and Indian companies
- Hourly rates in INR: ₹2,500 - ₹6,500

---

### 2. **Currency Conversion: $ → ₹**
All monetary values updated from USD to INR:

**Files Updated:**
- `src/pages/Profile.tsx` - Payment history display
- `src/pages/candidate/Results.tsx` - Alumni hourly rates
- `src/pages/candidate/Requests.tsx` - Session costs
- `src/pages/alumni/Requests.tsx` - Request pricing
- `src/pages/alumni/Payments.tsx` - Total earnings, averages
- `src/pages/alumni/Sessions.tsx` - Session payments
- `src/components/modals/PaymentModal.tsx` - Payment amount, button text
- `src/components/modals/RequestModal.tsx` - Duration pricing
- `src/components/dashboard/AlumniDashboard.tsx` - Earnings display

**Conversion Logic:**
- Original rates ($90-$150/hr) → New rates (₹2,500-₹6,500/hr)
- All `.toFixed(2)` changed to `.toFixed(0)` for INR (no decimals)
- Currency symbol: `$` → `₹`

---

### 3. **Advanced Points-Based Matching Engine**
Created `src/utils/matchingEngine.ts` - A sophisticated rule-based matching system.

#### Scoring System (Total: 100 points):

| Category | Max Points | Logic |
|----------|-----------|-------|
| **Degree Level Match** | 10 | Same degree level (B.Tech, MS, PhD, MBA) |
| **Degree Field Match** | 25 | Exact field match: AI, ML, Data Science, CS, etc. |
| **Partial Field Match** | 15 | Related fields (e.g., AI ↔ ML ↔ Data Science) |
| **Country Match** | 20 | Alumni studied in candidate's target country |
| **Skills Match** | 30 | 6 points per matched skill (AI, ML, Python, etc.) |
| **City Proximity** | 10 | Same current city |
| **India-based Bonus** | 5 | Alumni currently in India |
| **University Tier** | 15 | Top-tier: IITs, Stanford, MIT, CMU, etc. |
| **Industry Relevance** | 10 | Role matches candidate's field interest |

#### Features:
- **Field Extraction:** Parses degrees to identify: AI, ML, Data Science, CS, Business, Engineering
- **Skill Keywords:** Auto-detects relevant skills based on degree (e.g., "ML" → searches for PyTorch, TensorFlow)
- **Related Fields:** Groups similar domains (AI/ML/DS/CS, Business/Finance/Economics)
- **Tie-breaker:** Lower hourly rate wins if scores are equal

#### Match Reason Generation:
Produces human-readable explanations like:
> "Strong match on: AI specialization, 3 shared skills (Deep Learning, PyTorch), studied in USA. Priya Kulkarni can provide firsthand guidance on your journey."

---

### 4. **India-Focused Configuration Updates**

#### Countries List Expanded:
```typescript
const countries = [
  'USA', 'UK', 'Canada', 'Germany', 'Australia', 'Singapore', 
  'India' // Added for domestic education paths
];
```

#### Degree Options Updated:
```typescript
const degrees = [
  'MS Computer Science',
  'MS Artificial Intelligence',      // New
  'MS Data Science',
  'MS Machine Learning',             // New
  'MBA',
  'PhD Computer Science',            // New
  'B.Tech Computer Science',         // New (Indian degree)
  'B.E Computer Science',            // New (Indian degree)
  'MS Engineering'
];
```

---

### 5. **Landing Page Updates**
**File:** `src/pages/Landing.tsx`

**Hero Section Updated:**
```
"Get personalized, paid 1:1 mentorship for your study-abroad journey from India."
```
Emphasizes India as the starting point for international education aspirations.

---

## 🎯 How Matching Works Now

### Example: AI Career Path
**Candidate Input:**
- Degree: "MS Artificial Intelligence"
- Target Country: "USA"
- Current City: "Pune"

**Matching Process:**
1. ✅ **Field Detection:** Extracts "AI" from degree
2. ✅ **Skill Keywords:** Searches for [AI, Machine Learning, Deep Learning, NLP, Computer Vision]
3. ✅ **Scoring:**
   - Priya Kulkarni (Stanford AI, OpenAI): 95 points
     - +25 (AI specialization match)
     - +20 (USA country match)
     - +30 (5 AI skills matched)
     - +15 (Stanford tier)
     - +5 (India-based)
   - Sankalp Jadhav (CMU AI, Microsoft): 92 points
   - Rohan Deshmukh (CMU ML, Tesla): 88 points

4. ✅ **Result:** Top 3 ranked by score, with detailed match reasons

---

## 📁 New Files Created

### `src/utils/matchingEngine.ts`
- `calculateAlumniScore()` - Core scoring function
- `getTopMatches()` - Returns top 3 matches sorted by score
- `generateMatchReason()` - Creates human-readable explanations
- Helper functions: `extractDegreeLevel()`, `extractDegreeField()`, `isRelatedField()`, etc.

---

## 🔧 Technical Implementation Details

### Import Updates
**Before:**
```typescript
// CandidateDashboard.tsx
const matchedAlumni = allAlumni.filter(...).slice(0, 3);
```

**After:**
```typescript
import { getTopMatches, generateMatchReason } from '@/utils/matchingEngine';

const topMatches = getTopMatches(allAlumni, candidateData);
```

### Mock Data Structure
```typescript
{
  id: 'alumni-1',
  name: 'Vivek Kalmorge',
  degree: 'MS Computer Science',
  university: 'Stanford University',
  country: 'USA',
  currentCity: 'Pune', // Indian city
  skills: ['Machine Learning', 'System Design', 'Python', ...],
  hourlyRate: 5000, // INR
  linkedinUrl: 'https://www.linkedin.com/in/vivek-kalmorge/',
  bio: '...helping Indian students...',
}
```

---

## ✅ Testing Checklist

### Candidate Flow:
- [x] Sign up → Dashboard
- [x] Fill form: Degree "MS AI", Country "USA", City "Mumbai"
- [x] Click "Find my 3 best alumni"
- [x] See 3 matches with INR pricing (₹2,500 - ₹6,500)
- [x] Match reasons show field/skill overlaps
- [x] Send request → Draft email generated
- [x] Accept request → Pay Now enabled
- [x] Payment modal shows ₹ amount
- [x] Mock payment succeeds with ✓ animation
- [x] Leave review → Star rating + testimonial

### Alumni Flow:
- [x] Switch role to Alumni
- [x] See incoming requests with ₹ pricing
- [x] Accept/Reject with reasons
- [x] Suggest alternate time slots
- [x] View past sessions with reviews
- [x] Payments page shows total earnings in ₹

---

## 🚀 Running the Application

```bash
cd c:\Users\sangam.dange\source\repos\Project
npm install
npm run dev
```

**Access:** http://localhost:8081/

### Quick Demo Path:
1. Sign up as: `test@example.com`
2. Go to Dashboard
3. Fill:
   - LinkedIn: `https://linkedin.com/in/yourprofile`
   - Degree: `MS Artificial Intelligence`
   - Country: `USA`
   - City: `Mumbai`
4. Click "Find my 3 best alumni"
5. See matches: Priya Kulkarni (95%), Sankalp Jadhav (92%), etc.

---

## 🎨 UI/UX Considerations

### Professional, Minimal Design:
- ✅ Light mode only (no dark theme)
- ✅ Neutral color palette (grays, muted blues)
- ✅ Clean typography, spacious layouts
- ✅ Subtle shadows on cards
- ✅ Smooth transitions (no flashy animations)
- ✅ INR symbol (₹) consistently used
- ✅ Integer amounts for INR (no decimals)

---

## 📊 Sample Matching Scenarios

### Scenario 1: Data Science Student
**Input:** MS Data Science → USA
**Top Match:** Sugam Dange (MIT, Amazon) - 93% match
**Reason:** "MS Data Science, 4 shared skills (Python, ML, SQL, AWS), USA"

### Scenario 2: MBA Candidate
**Input:** MBA → USA
**Top Match:** (Would need MBA alumni in dataset)

### Scenario 3: IIT Aspirant
**Input:** B.Tech CS → India
**Top Match:** Aditya Sharma (IIT Bombay, Flipkart) - 88% match
**Reason:** "India-based, IIT tier, Product Management expertise"

---

## 🔮 Future Enhancements (Not in POC)

- [ ] Real LLM integration for dynamic email drafts
- [ ] Actual payment gateway (Razorpay/Stripe)
- [ ] Real-time notifications
- [ ] Video call integration (Zoom/Google Meet)
- [ ] Calendar sync
- [ ] More alumni profiles (100+)
- [ ] Advanced filters (budget, availability, language)
- [ ] Backend API with database

---

## 📞 Support

For questions or issues with this POC:
- Check console logs for matching scores
- Verify localStorage state: `localStorage.getItem('alumatch_user')`
- Alumni dataset: `src/data/mockAlumni.ts`
- Matching engine: `src/utils/matchingEngine.ts`

---

**Version:** India POC v1.0  
**Date:** December 6, 2025  
**Status:** ✅ Ready for Demo
