import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success && data.data?.user) {
        setUser(data.data.user);
        localStorage.setItem('codeSync_user', JSON.stringify(data.data.user));
      } else {
        setUser(null);
        localStorage.removeItem('codeSync_user');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      localStorage.removeItem('codeSync_user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data.data.user);
      localStorage.setItem('codeSync_user', JSON.stringify(data.data.user));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('codeSync_user');
    }
  };

  const signup = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Backend register usually logs in too (returns token) or requires login
      // userController.js registerUser sends token, so we can set user
      if (data.data?.token) {
         // Verify if registerUser returns user object inside data
         // looking at userController.js: it returns { success: true, message: ..., data: { token } }
         // It DOES NOT seem to return the user object directly in `data` based on my read of registerUser.
         // Wait, registerUser in userController.js:
         // res.status(201).json({ success: true, message: "...", data: { token } });
         // It does NOT return the user object. 
         // So we might need to fetch /me or rely on what we have. 
         // Actually, sendJWTToken helper puts user in data. 
         // But registerUser calls `user.getJWTToken()` then manually sends JSON?
         // Let's re-read registerUser in userController.js carefully.
         // Line 21: res.status(201).json({ ... data: { token } }) -- It does NOT call sendJWTToken!
         // This is an inconsistency in the backend. loginUser calls sendJWTToken, registerUser manually sends response.
         // If registerUser only sends token, I might need to call checkAuth() or manually decode token?
         // Or I can assume success and fetch /me.
         await checkAuth();
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    signup,
    loading,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
