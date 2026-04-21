# 🚀 Accounting & Inventory Management App - Complete Setup Guide

## Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Enter project name: `accounting-app`
4. Accept the default settings and create the project
5. Wait for the project to be created (1-2 minutes)

### 1.2 Set Up Authentication

1. In Firebase console, go to **Authentication** → **Get Started**
2. Select **Email/Password** as the sign-in method
3. Enable "Email/Password" and click "Save"

### 1.3 Set Up Firestore Database

1. Go to **Firestore Database** → **Create Database**
2. Choose **Start in test mode** (for development)
3. Select region closest to you
4. Click "Create"

### 1.4 Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Under **Your apps**, click the web icon `</>` 
3. Register your app as "web"
4. Copy your Firebase config (you'll need this in step 2)

Example config looks like:
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

---

## Step 2: Configure Environment Variables

1. In your project folder, create a `.env.local` file (copy from `.env.example`)
2. Add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Step 3: Set Up Firestore Security Rules

1. In Firebase console, go to **Firestore Database** → **Rules**
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only user can access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Products collection - only owner can access/modify
    match /products/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
    
    // Transactions collection - only owner can access/modify
    match /transactions/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click "Publish"

---

## Step 4: Start the Development Server

Run the following command in your project directory:

```bash
npm run dev
```

The application will automatically open at `http://localhost:3000`

---

## Step 5: Test the Application

### Create a Test Account

1. Click "Sign Up"
2. Enter an email and password (min 6 characters)
3. Enter a business name
4. Click "Sign Up"

### Test Features

**Dashboard:**
- View empty dashboard
- All metrics show 0 initially

**Inventory:**
- Click "+ Add Product"
- Add a test product:
  - Name: "Test Pen"
  - Category: "Stationery"
  - Stock: 100
  - Cost Price: 5
  - Selling Price: 10
- Save and verify it appears in the table

**Transactions:**
- Click "+ Add Transaction"
- Add a sales transaction:
  - Type: "Sales"
  - Product: "Test Pen"
  - Quantity: 5
  - Amount: 50
- Save and verify inventory stock decreases to 95

**Reports:**
- View Profit & Loss statement
- Check Revenue vs Expenses chart
- View Inventory Distribution pie chart

**Settings:**
- Update business name
- Change currency to USD
- Click "Save Changes"

---

## Step 6: Deploy to Vercel (Optional)

### 6.1 Push to GitHub

```bash
git add .
git commit -m "Initial commit - Accounting app setup"
git push origin main
```

### 6.2 Connect to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Import"

### 6.3 Add Environment Variables in Vercel

1. In Vercel project settings, go to **Environment Variables**
2. Add all your Firebase credentials (same as `.env.local`)
3. Click "Deploy"

---

## Project Files Overview

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/components/` | Reusable UI components (Navbar, Sidebar, etc.) |
| `src/pages/` | Full page components (Login, Dashboard, etc.) |
| `src/firebase/` | Firebase configuration and API functions |
| `src/charts/` | Recharts visualization components |
| `src/utils/` | Helper functions (date, calculations) |

### Important Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app component with routing |
| `src/firebase/config.js` | Firebase initialization |
| `src/firebase/auth.js` | Authentication functions |
| `src/firebase/db.js` | Database CRUD operations |
| `tailwind.config.js` | Tailwind CSS configuration |
| `.env.local` | Environment variables (create this) |

---

## Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Install new packages
npm install <package-name>
```

---

## Troubleshooting

### Issue: "Cannot find module 'firebase'"
**Solution:** Run `npm install` in the project directory

### Issue: Styling not appearing (white page)
**Solution:** Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Firebase connection error
**Solution:** 
- Check `.env.local` has correct Firebase credentials
- Verify Firestore Database is created in Firebase console
- Check internet connection

### Issue: Sign up not working
**Solution:**
- Use valid email format
- Password must be at least 6 characters
- Check Firebase Authentication is enabled

---

## Next Steps

1. **Customize UI**: Modify colors in `tailwind.config.js`
2. **Add more features**: Extend pages and components
3. **Set up CI/CD**: Connect GitHub for auto-deployment
4. **Add mobile app**: Create React Native version later
5. **Scale database**: Move to production Firestore plan when ready

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org)
- [Vite Documentation](https://vite.dev)

---

## Support & Contact

For help or issues:
1. Check the README.md file
2. Review Firebase console for errors
3. Check browser console (F12) for error messages
4. Ensure all environment variables are set correctly

Happy building! 🎉
