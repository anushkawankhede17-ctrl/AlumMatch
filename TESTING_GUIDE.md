# AlumMatch - Complete Testing Guide

## 🎯 Testing the Full Candidate → Alumni Flow

This guide walks you through testing the complete mentorship request flow from candidate to alumni.

---

## 📋 Test Scenario

**Goal:** Send a request as a candidate, then login as the alumni to see and respond to that request.

---

## 🔐 Step 1: Login as Alumni First (To Get Credentials)

Since alumni accounts are pre-seeded in `mockAlumni.ts`, you can login as any of them:

### Available Alumni Accounts:

| Name | Email | Password | Location | Rate |
|------|-------|----------|----------|------|
| **Vivek Kalmorge** | `vivek.kalmorge@alumni.stanford.edu` | `password` | Pune | ₹5,000/hr |
| **Sankalp Jadhav** | `sankalp.jadhav@alumni.cmu.edu` | `password` | Mumbai | ₹5,500/hr |
| **Sugam Dange** | `sugam.dange@alumni.mit.edu` | `password` | Bengaluru | ₹4,800/hr |
| **Atharva Patil** | `atharva.patil@alumni.gatech.edu` | `password` | Pune | ₹4,500/hr |
| **Anushka Wankhede** | `anushka.wankhede@alumni.berkeley.edu` | `password` | Mumbai | ₹5,200/hr |

**Note:** All alumni passwords are: `password`

---

## 🧪 Complete Test Flow

### **Part A: Create Candidate Account & Send Request**

#### 1. Logout (if logged in)
```
Click: User Menu (top right) → Logout
```

#### 2. Sign Up as Candidate
```
URL: http://localhost:8081/auth/signup

Fill:
- Name: Test Candidate
- Email: candidate@test.com
- Password: password123
- Select Role: ✓ Candidate

Click: Create account
```

#### 3. Go to Dashboard
```
After signup, you'll be redirected to Dashboard automatically
```

#### 4. Search for Alumni
```
Fill the form:
- Full Name: Test Candidate (auto-filled)
- LinkedIn URL: https://linkedin.com/in/testcandidate
- Intended Degree: MS Artificial Intelligence
- Current Country: India
- Target Country: USA
- Current City: Mumbai (optional)

Click: Find my 3 best alumni
```

#### 5. View Results
```
You should see 3 matched alumni, including:
- Sankalp Jadhav (CMU AI, Mumbai) - High match!
- Priya Kulkarni (Stanford AI, Bengaluru)
- Rohan Deshmukh (CMU ML, Hyderabad)
```

#### 6. Send Request to Vivek or Sankalp
```
On any alumni card, Click: Send Request

In the modal:
- Proposed Date: Select a future date (e.g., Dec 15, 2025)
- Proposed Time: 10:00
- Duration: 60 minutes - ₹5,500 (or 30/45 mins)
- Edit the email if needed
- Click: Send request from AlumMatch

You should see: "Request sent successfully!" toast
```

#### 7. Verify Request Sent
```
Navigate to: Requests (top navigation)

You should see your request under "Pending Requests":
- Status: PENDING
- Alumni: [Name you sent to]
- Proposed: [Date and time]
- Button: "Withdraw request" available
```

---

### **Part B: Login as Alumni & View Request**

#### 8. Logout from Candidate Account
```
Click: User Menu → Logout
```

#### 9. Login as the Alumni You Sent Request To
```
URL: http://localhost:8081/auth/login

Example (if you sent to Sankalp):
- Email: sankalp.jadhav@alumni.cmu.edu
- Password: password

Click: Log in
```

#### 10. Switch to Alumni Role (if needed)
```
The account has alumni role by default, but verify:
Top navigation shows: Role Selector → "Alumni Mode"
```

#### 11. Go to Incoming Requests
```
Navigate to: Requests (top navigation)

OR

Click: "Incoming Requests" from Alumni Dashboard
```

#### 12. View the Request
```
You should see the request you just sent:

Card shows:
- Request #[ID]
- Status: PENDING
- From: Test Candidate
- LinkedIn: [link]
- Proposed: [Date and Time] • Duration
- Price: ₹5,500 (or based on duration)
- Message preview: The email you drafted

Actions available:
[Accept] [Suggest Alternate Time] [Reject]
```

---

### **Part C: Test Alumni Actions**

#### 13. Option A: Accept Request
```
Click: Accept

Result:
✓ Success toast: "Request accepted! Candidate can now proceed with payment."
✓ Request disappears from Incoming Requests
✓ Request status → ACCEPTED
```

#### 13. Option B: Reject Request
```
Click: Reject

Modal opens:
- Reason: "Currently unavailable for mentorship"
- Click: Confirm Reject

Result:
✓ Success toast: "Request rejected"
✓ Request status → REJECTED
```

#### 13. Option C: Suggest Alternate Time
```
Click: Suggest Alternate Time

Modal opens:
- Suggested Date: Dec 16, 2025
- Suggested Time: 14:00
- Note: "I'm available in the afternoon. Does this work?"
- Click: Send Suggestion

Result:
✓ Success toast: "Alternate time suggested"
✓ Request status → ALTERNATE_SUGGESTED
```

---

### **Part D: Candidate Sees Response**

#### 14. Logout from Alumni & Login Back as Candidate
```
Logout → Login
Email: candidate@test.com
Password: password123
```

#### 15. Go to Requests
```
Navigate to: Requests

Based on alumni's action, you'll see:
```

**If ACCEPTED:**
```
✓ Status badge: "Accepted"
✓ Confirmation message shown
✓ [Pay Now] button is ENABLED
```

**If REJECTED:**
```
✓ Status badge: "Rejected"
✓ Rejection reason displayed
✓ No further actions available
```

**If ALTERNATE_SUGGESTED:**
```
✓ Status badge: "Alternate time suggested"
✓ Shows: "Alumni suggested: Dec 16 at 14:00"
✓ Alumni's note displayed
✓ [Accept alternate slot] button
✓ [Suggest another time] button
```

---

### **Part E: Test Payment Flow (if accepted)**

#### 16. Click Pay Now
```
Full-screen payment modal opens:

Shows:
- Session details
- Amount: ₹5,500
- [Pay ₹5,500] button
```

#### 17. Complete Payment
```
Click: Pay ₹5,500

Animation:
✓ Large checkmark animation
✓ "Payment successful (mock). Your session is confirmed."

After 2 seconds:
✓ Modal closes
✓ Toast: "Payment successful! Your session is confirmed."
✓ Request status → PAID
```

#### 18. Leave Review
```
After payment, in Requests:
- Status: PAID
- [Leave review] button appears

Click: Leave review

Modal:
- Star rating: Click 5 stars
- Testimonial: "Excellent session! Very helpful with AI career guidance."
- Click: Submit Review

Result:
✓ Review saved
✓ Alumni's rating updated
✓ Review visible in alumni profile
```

---

### **Part F: Alumni Views Completed Session**

#### 19. Login Back as Alumni
```
Logout → Login as sankalp.jadhav@alumni.cmu.edu
```

#### 20. View Past Sessions
```
Navigate to: Sessions (top navigation)

OR from Dashboard → "Past Sessions"

You should see:
- Candidate: Test Candidate
- Date/Time: [when request was made]
- Duration: 60 mins
- Amount: ₹5,500
- Rating: ⭐⭐⭐⭐⭐ (5 stars)
- Testimonial: "Excellent session! Very helpful..."
```

#### 21. View Payments Received
```
Navigate to: Payments

Shows:
- Total Earnings: ₹5,500
- Total Sessions: 1
- Avg per Session: ₹5,500

Payment list:
+ ₹5,500 | Test Candidate | 60 mins | [Date]
```

---

## 🔍 Key Things to Verify

### Authentication
- ✅ Can login with alumni email from mockAlumni.ts
- ✅ Can create new candidate account
- ✅ Can switch between roles (if account has both)
- ✅ Logout works correctly

### Matching
- ✅ Search returns 3 alumni
- ✅ Match scores displayed (85-95%)
- ✅ Match reasons show skills, location, etc.
- ✅ Alumni from target country prioritized

### Request Flow
- ✅ Send request creates proper request object
- ✅ Alumni sees request immediately on login
- ✅ All three actions work (Accept/Reject/Alternate)
- ✅ Status updates reflect on candidate side

### Payment
- ✅ Pay Now button enabled only after acceptance
- ✅ Mock payment animation works
- ✅ Payment amount calculated correctly based on duration
- ✅ Status updates to PAID

### Reviews
- ✅ Can leave review after payment
- ✅ Star rating saves correctly
- ✅ Testimonial text displayed
- ✅ Alumni sees review in Past Sessions

### State Persistence
- ✅ Logout and login preserves all data
- ✅ Requests persist across sessions
- ✅ Payments recorded correctly
- ✅ Reviews attached to correct request

---

## 🐛 Common Issues & Solutions

### Issue: "Alumni not found"
**Solution:** Use exact email from mockAlumni.ts list above

### Issue: "No requests showing"
**Solution:** 
- Verify you're logged in as the correct alumni
- Check the request was sent to this alumni's ID
- Ensure request status is PENDING

### Issue: "Pay Now button disabled"
**Solution:** Alumni must accept the request first

### Issue: "Request disappeared"
**Solution:** 
- Check if it moved to different status section
- Alumni requests only show PENDING in Incoming Requests
- Check Past Sessions or completed requests

---

## 🎬 Quick Test Script

```bash
# 1. Create candidate account
Signup → candidate@test.com / password123

# 2. Search alumni
Degree: MS AI, Country: India → USA, City: Mumbai

# 3. Send request to Sankalp Jadhav
Click: Send Request → Fill date/time → Send

# 4. Login as alumni
Logout → Login: sankalp.jadhav@alumni.cmu.edu / password

# 5. View & accept request
Requests → Accept

# 6. Login back as candidate
Logout → Login: candidate@test.com

# 7. Complete payment
Requests → Pay Now → Pay ₹5,500

# 8. Leave review
Leave Review → 5 stars → Submit

# 9. Login as alumni to see completed session
Logout → Login: sankalp.jadhav@alumni.cmu.edu
Sessions → View completed session with review
```

---

## 💾 Data Locations (for debugging)

All data is stored in browser's localStorage:

```javascript
// View in browser console (F12):

// Current user
localStorage.getItem('alumatch_user')

// All requests
localStorage.getItem('alumatch_requests')

// All payments
localStorage.getItem('alumatch_payments')

// Search history
localStorage.getItem('alumatch_searches')

// Registered users (non-alumni)
localStorage.getItem('alumatch_users')
```

---

## ✅ Success Criteria

Your test is successful if:

1. ✅ Candidate can search and find alumni
2. ✅ Request appears in alumni's Incoming Requests
3. ✅ Alumni can accept/reject/suggest alternate
4. ✅ Candidate sees status update immediately
5. ✅ Payment flow works with animation
6. ✅ Review saves and displays on alumni profile
7. ✅ All data persists across logout/login

---

**Happy Testing! 🚀**

For more details, see:
- `INDIA_POC_CHANGES.md` - Full implementation details
- `DASHBOARD_UPDATE.md` - Matching logic documentation
