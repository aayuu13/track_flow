# Accounting & Inventory Management Web Application

A modern, cloud-enabled business management tool for small businesses. Built with React, Firebase, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Secure login/signup with Firebase Auth
- 📊 **Dashboard**: Real-time overview of key metrics and trends
- 📦 **Inventory Management**: Track products, stock levels, and low-stock alerts
- 💳 **Transaction Management**: Record sales, purchases, returns, and expenses
- 📈 **Reports & Analytics**: Visual reports with Recharts
- ⚙️ **Settings**: Manage business profile and preferences
- 🌐 **Real-time Sync**: Firestore real-time updates across all devices

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **Charts**: Recharts
- **Routing**: React Router
- **Deployment**: Vercel

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   cd "c:\Users\HELIOS\Documents\Accounting Software\accounting-app"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Get your Firebase config

4. **Create `.env.local` file**
   ```bash
   cp .env.example .env.local
   ```
   Add your Firebase credentials to `.env.local`

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

## Firestore Rules

Add these security rules to your Firestore:

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

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── Inventory.jsx
│   ├── Transactions.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── charts/
│   ├── SalesLineChart.jsx
│   ├── RevenueExpensesBarChart.jsx
│   └── InventoryPieChart.jsx
├── firebase/
│   ├── config.js
│   ├── auth.js
│   └── db.js
├── utils/
│   ├── calculatePL.js
│   └── dateUtils.js
└── App.jsx
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment (Vercel)

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add Firebase environment variables in Vercel settings
4. Deploy with one click

## Usage Guide

### Dashboard
- View daily sales, expenses, and inventory value
- See top-selling products
- Monitor sales trends

### Inventory
- Add new products with cost and selling prices
- Track stock levels
- Get low-stock alerts
- Edit or delete products

### Transactions
- Record sales, purchases, returns
- Add expenses
- Auto-update inventory
- View transaction history

### Reports
- Profit & Loss statement
- Sales trends (line chart)
- Revenue vs Expenses (bar chart)
- Inventory distribution (pie chart)
- Expense breakdown by category

### Settings
- Update business name
- Change currency preference
- Manage profile information

## Features in Progress

- Multi-user teams (Admins, cashiers)
- PDF/Excel export
- Mobile app
- Payment gateway integration
- Barcode scanner support
- GST/VAT calculation

## Troubleshooting

### Firebase Connection Issues
- Verify all environment variables are correct
- Check Firestore is enabled in Firebase console
- Confirm security rules are properly set

### Styling Issues
- Clear browser cache (Ctrl+Shift+Del)
- Run `npm install` again
- Rebuild Tailwind CSS

### Authentication Errors
- Check email format
- Ensure password is at least 6 characters
- Verify Firebase Authentication is enabled

## Support

For issues or questions, please create an issue on GitHub.

## License

MIT License - feel free to use for personal or commercial projects.

---

Happy coding! 🚀

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
