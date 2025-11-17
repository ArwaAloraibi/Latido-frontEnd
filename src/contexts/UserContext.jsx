// UserContext - provides user data to all components
// This is a React Context that stores the current logged-in user
// Any component can access the user data without passing props down

import { createContext, useState, useEffect } from 'react';

// Create the context - this is like creating a global variable
const UserContext = createContext();

function UserProvider({ children }) {
  // Helper function to decode the JWT token and get user info
  // JWT tokens have 3 parts separated by dots - we need the middle part
  const getUserFromToken = () => {
    const token = localStorage.getItem('token');

    // If no token, user is not logged in
    if (!token) return null;

    try {
      // Split token by dots, get the middle part (index 1), decode it from base64
      const decoded = JSON.parse(atob(token.split('.')[1]));
      // Debug: log the decoded token to see what's in it
      console.log('Decoded JWT token:', decoded);
      return decoded;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  };

  // Create state to store the current user
  // Initialize it with user data from token if token exists
  const [user, setUser] = useState(getUserFromToken());

  // Refresh user data when component mounts or token changes
  useEffect(() => {
    const refreshUser = () => {
      const tokenUser = getUserFromToken();
      if (tokenUser) {
        setUser(tokenUser);
      } else {
        setUser(null);
      }
    };

    // Refresh on mount (when app first loads)
    refreshUser();

    // Listen for storage changes - this handles when user logs in/out in another tab
    // This way all tabs stay in sync
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        refreshUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Clean up event listener when component unmounts
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // This is the value we're providing to all child components
  // It includes both the user data and the function to update it
  const value = { user, setUser };

  return (
    <UserContext.Provider value={value}>
      {/* All children components can now access user and setUser */}
      {children}
    </UserContext.Provider>
  );
}

// Export both the provider (to wrap the app) and the context (to use in components)
export { UserProvider, UserContext };
