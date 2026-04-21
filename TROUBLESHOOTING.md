# 🐛 Troubleshooting & FAQ

## Common Issues & Solutions

---

## ❌ Installation Issues

### Issue: `npm install` fails

**Error Message:**
```
npm ERR! code E401
npm ERR! Invalid authentication for npm
```

**Solutions:**
1. Try clearing npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```
2. Check internet connection
3. Try upgrading npm:
   ```bash
   npm install -g npm@latest
   npm install
   ```

---

### Issue: Node modules error

**Error Message:**
```
Cannot find module 'react'
Cannot find module 'firebase'
```

**Solutions:**
1. Delete `node_modules` and reinstall:
   ```bash
   rm -r node_modules package-lock.json
   npm install
   ```
2. On Windows PowerShell:
   ```powershell
   Remove-Item node_modules -Recurse -Force
   Remove-Item package-lock.json
   npm install
   ```

---

## ❌ Firebase Connection Issues

### Issue: "Firebase initialization failed"

**Error Message:**
```
Error: Failed to get document because the client is offline
Cannot initialize Firebase: Invalid config
```

**Solutions:**
1. **Check `.env.local` file:**
   - Copy it from `.env.example`
   - Verify all Firebase keys are correct
   - No extra spaces or quotes

2. **Verify Firebase console:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Make sure Firestore Database is "Created" (not "Creating")
   - Check Authentication is enabled

3. **Test connection:**
   ```bash
   npm run dev
   # Check browser console (F12) for errors
   ```

### Issue: "Permission denied" in Firestore

**Error Message:**
```
The caller does not have permission to execute the specified operation
```

**Solutions:**
1. Check Firestore security rules in `SETUP_GUIDE.md`
2. Go to Firebase → Firestore → Rules
3. Replace with correct rules (from SETUP_GUIDE)
4. Make sure you're using **test mode** for development

### Issue: Real-time updates not working

**Solutions:**
1. Check browser DevTools → Network tab
2. Verify Firestore rules allow reads
3. Clear browser cache: Ctrl+Shift+Del
4. Restart dev server: `npm run dev`

---

## ❌ Authentication Issues

### Issue: "Email already in use"

**Error Message:**
```
Firebase: Error (auth/email-already-in-use)
```

**Solutions:**
1. Use a different email address
2. Or delete user from Firebase Console → Authentication
3. Refresh page and try again

### Issue: "Password should be at least 6 characters"

**Solutions:**
1. Your password is too short
2. Use at least 6 characters
3. Example: `password123`

### Issue: Sign in fails but sign up works

**Error Message:**
```
Firebase: Error (auth/user-not-found)
Firebase: Error (auth/wrong-password)
```

**Solutions:**
1. Check email is correct (case-sensitive)
2. Check password is correct
3. Use the same email you signed up with
4. Check Caps Lock is off

### Issue: Session not persisting

**Solutions:**
1. Clear browser cookies: Settings → Privacy
2. Close and reopen browser
3. Try different browser (Chrome, Firefox)

---

## ❌ Styling & Display Issues

### Issue: Page looks broken (white screen)

**Error Message:**
```
Blank white page
No styling visible
```

**Solutions:**
1. Hard refresh browser:
   - Windows: Ctrl+Shift+R
   - Mac: Cmd+Shift+R
2. Clear browser cache:
   - Press F12 → Application → Cache → Clear
3. Check if Tailwind CSS compiled:
   - Open DevTools (F12) → Elements
   - Check if `<style>` tags exist
4. Restart dev server:
   ```bash
   npm run dev
   ```

### Issue: Buttons/inputs look wrong

**Solutions:**
1. Check `index.css` has Tailwind imports:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
2. Verify `tailwind.config.js` exists
3. Verify `postcss.config.js` exists

---

## ❌ Development Server Issues

### Issue: "Port 3000 is already in use"

**Error Message:**
```
Error: Port 3000 is already in use
EADDRINUSE :::3000
```

**Solutions:**

**On Windows (PowerShell):**
```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000

# Kill the process (replace PID number)
Stop-Process -Id <PID> -Force

# Or use different port
npm run dev -- --port 3001
```

**On Mac/Linux:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3001
```

### Issue: "Cannot find module 'vite'"

**Solutions:**
```bash
npm install
npm run dev
```

---

## ❌ Data Issues

### Issue: Products/Transactions not showing

**Error Message:**
```
No products/transactions appear in the app
```

**Solutions:**
1. **Check Firestore:**
   - Go to Firebase Console → Firestore Database
   - Check if collections exist: `products`, `transactions`, `users`
   - Look for your data

2. **Check user is logged in:**
   - Verify email shown in top-right corner
   - Check browser DevTools → Application → Local Storage

3. **Check real-time listeners:**
   - Open DevTools → Console (F12)
   - Look for any Firebase errors

4. **Try re-login:**
   - Click Logout
   - Click Signup with new account
   - Add product and save

### Issue: Changes not syncing

**Solutions:**
1. Hard refresh: Ctrl+Shift+R
2. Check internet connection
3. Verify Firestore rules allow write access
4. Check browser console for errors (F12)

---

## ⚠️ Performance Issues

### Issue: App loads slowly

**Solutions:**
1. Check network tab (F12 → Network)
2. Verify Firebase is responding
3. Check for large data sets
4. Try production build:
   ```bash
   npm run build
   npm run preview
   ```

### Issue: Charts not rendering

**Solutions:**
1. Check transaction data exists
2. Verify Recharts is installed:
   ```bash
   npm install recharts
   ```
3. Check browser console for errors

---

## 📝 How to Debug

### Step 1: Check Browser Console
```
Press F12 → Console tab
Look for red error messages
```

### Step 2: Check Network Tab
```
Press F12 → Network tab
Refresh page
Look for failed requests (red)
```

### Step 3: Check Firebase Console
```
Go to console.firebase.google.com
Check Firestore Database
Check Authentication users
Check Realtime Database rules
```

### Step 4: Check Terminal Output
```
Look for error messages in terminal where 'npm run dev' is running
```

### Step 5: Check .env.local
```
Verify VITE_FIREBASE_* variables are set
No typos
No missing values
```

---

## 🆘 Getting Help

### Information to provide when asking for help:

1. **Error message** (exact text)
2. **Browser console errors** (F12 → Console)
3. **What were you doing** when it failed
4. **Have you tried** the solutions above
5. **Your environment** (Node version, OS)

**Check this with:**
```bash
node --version
npm --version
```

---

## ✅ Verification Checklist

Before reporting an issue, verify:

- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm packages installed (`npm install`)
- [ ] `.env.local` created with Firebase keys
- [ ] Firebase project created
- [ ] Firestore Database created (not just "Creating")
- [ ] Authentication enabled (Email/Password)
- [ ] Security rules set correctly
- [ ] Internet connection working
- [ ] Browser cache cleared
- [ ] Dev server restarted (`npm run dev`)

---

## 📚 Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vite.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [Node.js Docs](https://nodejs.org/en/docs/)

---

## Still Stuck?

1. Read `SETUP_GUIDE.md` again carefully
2. Watch the setup steps video (if available)
3. Try with a fresh Vite project
4. Restart your computer
5. Reinstall Node.js fresh

Good luck! 🚀
