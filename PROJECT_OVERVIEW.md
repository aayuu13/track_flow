Root Directory
index.html

Acts as the entry point for the application.
Contains a <div id="root"></div> where the React app is mounted.
Loads the main JavaScript file (src/main.jsx) to bootstrap the app.
package.json

Defines project metadata, dependencies, and scripts for building, running, and testing the app.
vite.config.js

Configuration file for Vite, the build tool used in this project.
tailwind.config.js

Configuration for Tailwind CSS, specifying custom styles and themes.
README.md

Provides an overview of the project, setup instructions, and usage details.
src Directory
App.jsx

The main React component that sets up routing and context providers.
Manages authentication state and renders different pages based on user login status.
main.jsx

The entry point for the React app.
Renders the App component into the root DOM node.
charts/InventoryPieChart.jsx

A reusable component that displays inventory data as a pie chart using recharts.
components/Navbar.jsx

Implements the navigation bar, including user authentication and sidebar toggling.
context/SidebarContext.jsx

Provides context for managing the state of the sidebar (open/close).
Includes helper functions like toggleSidebar and closeSidebar.
firebase/auth.js

Handles Firebase authentication logic, such as login and logout.
pages/

Contains React components for different pages:
Dashboard.jsx: Displays an overview of key metrics.
Inventory.jsx: Manages inventory data.
Login.jsx: Handles user login.
Signup.jsx: Handles user registration.
Reports.jsx: Displays financial reports.
Settings.jsx: Allows users to configure app settings.
Transactions.jsx: Manages transaction records.
utils/calculatePL.js

Utility function for calculating profit and loss.
Program Flow
Initialization

The app starts with index.html, which loads src/main.jsx.
main.jsx renders the App component into the DOM.
Authentication

App.jsx listens for authentication state changes using Firebase.
Based on the user's login status, it renders either the login/signup pages or the main app.
Routing

App.jsx sets up routes for different pages using react-router-dom.
Protected routes ensure only authenticated users can access certain pages.
State Management

The SidebarContext manages the sidebar's open/close state.
The AuthContext provides user authentication data throughout the app.
UI Components

Components like Navbar and Sidebar provide navigation and layout.
Pages like Dashboard and Inventory display specific data and functionality.
Data Visualization

Charts like InventoryPieChart visualize data using libraries like recharts.