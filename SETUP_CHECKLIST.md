# ✅ Setup Checklist - Complete These Steps

Use this checklist to set up your Accounting & Inventory Management app. ✓ Mark items as you complete them.

---

## 📋 PRE-SETUP CHECKLIST

Before you start, make sure you have:

- [ ] Node.js installed (v16+) - [Download](https://nodejs.org)
  ```bash
  node --version  # Should show v16.0.0 or higher
  ```
- [ ] Code editor (VS Code recommended) - [Download](https://code.visualstudio.com)
- [ ] Google/Email account for Firebase
- [ ] Internet connection

---

## 🔥 FIREBASE SETUP (10 minutes)

### Step 1: Create Firebase Project
- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Click "Create a new project"
- [ ] Enter project name: `accounting-app`
- [ ] Accept defaults and click "Create"
- [ ] Wait for project creation (1-2 minutes)

### Step 2: Enable Authentication
- [ ] Click "Authentication" in left menu
- [ ] Click "Get Started"
- [ ] Select "Email/Password"
- [ ] Turn on the toggle
- [ ] Click "Save"

### Step 3: Create Firestore Database
- [ ] Click "Firestore Database" in left menu
- [ ] Click "Create Database"
- [ ] Choose "Start in test mode"
- [ ] Select region (closest to you)
- [ ] Click "Create"
- [ ] Wait for database creation (1-2 minutes)

### Step 4: Get Firebase Config
- [ ] Click settings icon ⚙️ (top left)
- [ ] Click "Project Settings"
- [ ] Scroll to "Your apps" section
- [ ] Click web icon `</>`
- [ ] Register app as "web"
- [ ] Copy the config code (starts with `const firebaseConfig = {`)

Example config:
```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "accounting-app-xxxxx.firebaseapp.com",
  projectId: "accounting-app-xxxxx",
  storageBucket: "accounting-app-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
}
```

- [ ] Copy all 6 values to a notepad

---

## 🔐 FIRESTORE SECURITY RULES (5 minutes)

### Step 1: Add Security Rules
- [ ] Go to "Firestore Database" in Firebase console
- [ ] Click "Rules" tab
- [ ] Clear all existing text
- [ ] Copy-paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /products/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
    match /transactions/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

- [ ] Click "Publish"
- [ ] Wait for publish confirmation

---

## 💻 LOCAL SETUP (5 minutes)

### Step 1: Create Environment File
- [ ] Open the project folder in your code editor
- [ ] Open `.env.example` file
- [ ] Create new file: `.env.local`
- [ ] Copy all contents from `.env.example` to `.env.local`

### Step 2: Add Firebase Keys
- [ ] In `.env.local`, replace the values:

| Variable | From Firebase Config |
|----------|---------------------|
| `VITE_FIREBASE_API_KEY` | `apiKey` value |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` value |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` value |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` value |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` value |
| `VITE_FIREBASE_APP_ID` | `appId` value |

Example `.env.local`:
```env
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=accounting-app-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=accounting-app-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=accounting-app-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef...
```

- [ ] Save the file (Ctrl+S)
- [ ] **IMPORTANT:** Don't share this file or commit to GitHub!

---

## 🚀 START DEVELOPMENT SERVER (1 minute)

### Step 1: Open Terminal
- [ ] Open terminal/command prompt
- [ ] Navigate to project folder:
  ```bash
  cd "c:\Users\HELIOS\Documents\Accounting Software\accounting-app"
  ```

### Step 2: Run Development Server
- [ ] Type command:
  ```bash
  npm run dev
  ```
- [ ] Wait for message: `Local: http://localhost:3000`
- [ ] Press Enter
- [ ] Browser opens automatically to `http://localhost:3000`

**✅ If you see the login page, setup is successful!**

---

## ✅ TESTING THE APP (10 minutes)

### Step 1: Create Account
- [ ] Click "Sign Up" link
- [ ] Enter email: `test@example.com`
- [ ] Enter password: `password123`
- [ ] Enter business name: `Test Business`
- [ ] Click "Sign Up"
- [ ] Wait for redirect to Dashboard

**✅ If you see Dashboard with 0 values, sign up worked!**

### Step 2: Test Inventory
- [ ] Click "📦 Inventory" in sidebar
- [ ] Click "+ Add Product"
- [ ] Fill in form:
  - Name: `Test Pen`
  - Category: `Stationery`
  - Stock: `100`
  - Cost Price: `5`
  - Selling Price: `10`
- [ ] Click "Save Product"
- [ ] Verify product appears in table

**✅ If product appears, inventory works!**

### Step 3: Test Transaction
- [ ] Click "💳 Transactions"
- [ ] Click "+ Add Transaction"
- [ ] Fill in form:
  - Type: `Sales`
  - Product: `Test Pen`
  - Quantity: `5`
  - Amount: `50`
- [ ] Click "Add Transaction"
- [ ] Verify transaction appears in table
- [ ] Check inventory - stock should be 95

**✅ If stock decreased, transactions work!**

### Step 4: Test Reports
- [ ] Click "📈 Reports"
- [ ] Verify charts display data
- [ ] Check P&L Statement shows values

**✅ If reports show data, everything works!**

---

## 🎉 SETUP COMPLETE!

All items checked? Congratulations! ✅

Your accounting app is now **fully functional and ready to use!**

---

## 📚 Next Steps

### Option A: Start Using
- [ ] Add your real products
- [ ] Record real transactions
- [ ] Monitor reports
- [ ] Configure settings

### Option B: Customize
- [ ] Read `PROJECT_STRUCTURE.md` to understand code
- [ ] Modify colors in `tailwind.config.js`
- [ ] Add new features to pages
- [ ] Extend functionality

### Option C: Deploy
- [ ] Read `README.md` Deployment section
- [ ] Push code to GitHub
- [ ] Connect to Vercel
- [ ] Deploy with one click

---

## 🆘 TROUBLESHOOTING

If you encounter issues:

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Run `npm run dev -- --port 3001` |
| npm install fails | Delete `node_modules`, run `npm install` again |
| Blank white page | Press Ctrl+Shift+R to hard refresh |
| Firebase connection error | Check `.env.local` has correct keys |
| Can't sign up | Use email format, 6+ char password |
| See nothing in app | Check browser console (F12) for errors |

See `TROUBLESHOOTING.md` for 20+ solutions.

---

## ✨ Summary

```
15 minutes → Firebase setup complete
5 minutes  → Local configuration
1 minute   → Start development server
10 minutes → Test all features
─────────────────────────────
31 minutes → FULLY READY! ✅
```

---

## 💡 Tips

✅ Keep `.env.local` safe - don't share with anyone
✅ Don't commit `.env.local` to GitHub
✅ Restart dev server if changes don't appear
✅ Hard refresh browser if styles don't update
✅ Check browser console (F12) when something breaks

---

## 📞 Need Help?

- **Quick issues?** → `TROUBLESHOOTING.md`
- **Setup problems?** → `SETUP_GUIDE.md`
- **Understanding code?** → `PROJECT_STRUCTURE.md`
- **Need overview?** → `README.md`

---

## ✅ Final Checklist

Before you start using the app:

- [ ] Firebase project created
- [ ] Firestore Database created
- [ ] Authentication enabled
- [ ] Security rules added
- [ ] `.env.local` created with keys
- [ ] `npm run dev` starts without errors
- [ ] App loads in browser
- [ ] Can sign up successfully
- [ ] Can add product
- [ ] Can add transaction
- [ ] Can view reports

**All checked? You're ready to go! 🚀**

---

**Good luck and happy accounting! 🎊**

---

Date Started: _______________  
Date Completed: _______________  
Status: ☐ Not Started  ☐ In Progress  ☐ Complete ✅
