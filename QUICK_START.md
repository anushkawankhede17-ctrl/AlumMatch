# 🚀 AlumMatch - 5 Minute Quick Start

## ⚡ Fastest Way to Test the Complete Flow

### Step 1: Open App
```
http://localhost:8081/
```

### Step 2: Sign Up as Candidate (30 seconds)
```
Click: Get Started
Fill:
  Name: Test Student
  Email: test@student.com
  Password: password123
  Role: ✓ Candidate
Click: Create account
```

### Step 3: Find Alumni (30 seconds)
```
Dashboard → Fill form:
  LinkedIn: https://linkedin.com/in/test
  Degree: MS Artificial Intelligence
  Current Country: India
  Target Country: USA
  City: Mumbai

Click: Find my 3 best alumni
```

### Step 4: Send Request (1 minute)
```
On Sankalp Jadhav's card:
  Click: Send Request
  
Modal:
  Date: Dec 15, 2025
  Time: 10:00
  Duration: 60 minutes - ₹5,500
  (Email is auto-generated, edit if needed)
  
Click: Send request from AlumMatch
```

### Step 5: Login as Alumni (30 seconds)
```
Click: Logout

Login:
  Email: sankalp.jadhav@alumni.cmu.edu
  Password: password
```

### Step 6: View & Accept Request (30 seconds)
```
Dashboard → Click: Incoming Requests
(or click "Requests" in top nav)

You'll see the request from "Test Student"

Click: Accept
```

### Step 7: Complete Payment as Candidate (1 minute)
```
Click: Logout

Login:
  Email: test@student.com
  Password: password123

Navigate to: Requests

Under "Accepted Requests":
  Click: Pay Now
  
Modal shows ₹5,500
  Click: Pay ₹5,500

✓ Watch the checkmark animation!
```

### Step 8: Leave Review (30 seconds)
```
Same page, under "Paid Requests":
  Click: Leave review
  
Modal:
  Stars: Click 5 stars ⭐⭐⭐⭐⭐
  Text: "Great session on AI career guidance!"
  
Click: Submit Review
```

### Step 9: View as Alumni (30 seconds)
```
Click: Logout

Login:
  Email: sankalp.jadhav@alumni.cmu.edu
  Password: password

Navigate to: Sessions

You'll see:
  ✓ Completed session
  ✓ ₹5,500 payment
  ✓ 5-star review
  ✓ Testimonial

Navigate to: Payments

You'll see:
  ✓ Total Earnings: ₹5,500
  ✓ Payment details
```

---

## ✅ Done! 

You've tested the complete flow in **5 minutes**!

---

## 🎯 What You Just Tested

1. ✅ Candidate signup
2. ✅ AI-powered matching (India → USA)
3. ✅ Request sending with email draft
4. ✅ Alumni receiving request
5. ✅ Alumni accepting request
6. ✅ Mock payment with animation
7. ✅ Review & rating system
8. ✅ Alumni earnings tracking
9. ✅ Complete state persistence

---

## 🔄 Test Other Scenarios

### Rejection Flow:
```
Step 6 → Click: Reject
  Enter reason: "Currently unavailable"
  Confirm
  
Login as candidate → See rejection reason
```

### Alternate Time Flow:
```
Step 6 → Click: Suggest Alternate Time
  Date: Dec 16, 2025
  Time: 14:00
  Note: "Afternoon works better"
  Send
  
Login as candidate → See alternate suggestion
  Click: Accept alternate slot (or suggest another)
```

### City-based Matching:
```
Step 3 → City: Mumbai
  You'll see Sankalp & Anushka at top (both in Mumbai)
  Match reason includes: "same city (Mumbai)"
```

---

## 💡 Pro Tips

**Multiple Requests:**
- Send requests to 2-3 alumni at once
- Test different statuses simultaneously

**Role Switching:**
- Create account with BOTH roles
- Use role selector to switch instantly

**Data Reset:**
- Open browser console (F12)
- Run: `localStorage.clear()`
- Refresh page for clean state

---

**Need detailed steps?** See `TESTING_GUIDE.md`

**Need credentials?** See `ALUMNI_CREDENTIALS.md`
