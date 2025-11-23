import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TEMPORARY: Auto-login as admin - bypassing actual authentication
    // TODO: Remove this and restore normal login flow
    const autoLoginAdmin = () => {
      const adminUser = {
        id: 'admin-auto-login-temp',
        email: 'admin@sage.org',
        firstName: 'Admin',
        lastName: 'User',
        role: 'Admin',
        isActive: true,
        organisationId: null, // Will be set by backend if needed
        organisation: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Set a dummy token for API calls (backend may reject this, but UI will work)
      const dummyToken = 'auto-login-admin-token-bypass';
      
      try {
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        console.log('Auto-logged in as admin (bypass mode)');
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        // Still set user in state even if localStorage fails
        setUser(adminUser);
      }
    };

    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      // If no saved user, auto-login as admin
      if (!token || !savedUser) {
        autoLoginAdmin();
      } else {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Error parsing saved user data:', parseError);
          // Clear corrupted data and auto-login as admin
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          autoLoginAdmin();
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Auto-login as admin on error
      autoLoginAdmin();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      const { user, token } = response.data;
      
      if (!user || !token) {
        throw new Error('Invalid response from server: missing user or token');
      }
      
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        // Still set user in state even if localStorage fails
        setUser(user);
      }
      
      return user;
    } catch (error) {
      // Re-throw the error so LoginPage can handle it
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    setUser(null);
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

