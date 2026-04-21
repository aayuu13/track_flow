# 🎯 Quick Start Guide - 5 Minutes to Running

## Prerequisites ✅
- Node.js installed
- Firebase account (free)
- Code editor (VS Code recommended)

---

## 1️⃣ Firebase Setup (2 minutes)

**Visit:** [Firebase Console](https://console.firebase.google.com)

1. Create new project → name it `accounting-app`
2. Go to **Authentication** → Enable **Email/Password**
3. Go to **Firestore Database** → Create in **test mode**
4. Click **Settings** (⚙️) → Copy your config

Your config will look like:
```
apiKey: AIzaSy...
authDomain: accounting-app-xxxxx.firebaseapp.com
projectId: accounting-app-xxxxx
storageBucket: accounting-app-xxxxx.appspot.com
messagingSenderId: 123456789...
appId: 1:123456789:web:abcd...
```

---

## 2️⃣ Configure App (1 minute)

In project folder, create **`.env.local`** and paste:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=accounting-app-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=accounting-app-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=accounting-app-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789...
VITE_FIREBASE_APP_ID=1:123456789:web:abcd...
```

---

## 3️⃣ Install & Run (2 minutes)

```bash
npm install
npm run dev
```

App opens at: **http://localhost:3000**

---

## 4️⃣ Test It! (Create Account)

1. Click **Sign Up**
2. Enter email, password, business name
3. Done! ✨

---

## What's Included?

✅ Authentication (Login/Signup)  
✅ Dashboard with real-time metrics  
✅ Inventory management  
✅ Transaction tracking  
✅ Reports & Analytics  
✅ Settings page  
✅ Beautiful UI with Tailwind CSS  
✅ Real-time Firestore sync  

---

## Need Help?

- See `SETUP_GUIDE.md` for detailed instructions
- Check `README.md` for full documentation
- Firebase rules already included in `SETUP_GUIDE.md`

---

## What To Do Next?

- Add test products in Inventory
- Create test transactions
- View reports and analytics
- Customize in Settings
- Deploy to Vercel (see README)

Enjoy! 🚀
