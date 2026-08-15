import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load state from localStorage on mount
  useEffect(() => {
    // 1. Load registry of users
    const savedUsers = localStorage.getItem('hg_registered_users');
    let usersList = [];
    if (savedUsers) {
      try {
        usersList = JSON.parse(savedUsers);
      } catch (e) {
        console.error('Failed to parse registered users list', e);
      }
    }

    // Seed default clinician if empty
    if (usersList.length === 0) {
      const defaultUser = {
        name: 'Dr. Sarah Connor',
        email: 'doctor@healthgen.ai',
        password: 'password123',
        role: 'Chief Medical Officer',
        avatar: '🩺'
      };
      usersList = [defaultUser];
      localStorage.setItem('hg_registered_users', JSON.stringify(usersList));
    }
    setRegisteredUsers(usersList);

    // 2. Load active login session
    const savedUser = localStorage.getItem('hg_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse active user session', e);
        localStorage.removeItem('hg_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Validate credentials against our registered users
    const matched = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (matched) {
      // Create session user (exclude password for session security)
      const sessionUser = {
        name: matched.name,
        email: matched.email,
        role: matched.role || 'Senior Diagnostician',
        avatar: matched.avatar || '🩺'
      };
      setUser(sessionUser);
      localStorage.setItem('hg_user', JSON.stringify(sessionUser));
      return { success: true };
    }

    return { 
      success: false, 
      message: 'Invalid email or password. Please try again or create an account.' 
    };
  };

  const register = (name, email, password) => {
    // Check if email already exists
    const exists = registeredUsers.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      return { success: false, message: 'This email address is already registered.' };
    }

    const newUser = {
      name,
      email,
      password,
      role: 'Senior Diagnostician',
      avatar: '🩺'
    };

    const updatedRegistry = [...registeredUsers, newUser];
    setRegisteredUsers(updatedRegistry);
    localStorage.setItem('hg_registered_users', JSON.stringify(updatedRegistry));

    // Auto-login registered user
    const sessionUser = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar
    };
    setUser(sessionUser);
    localStorage.setItem('hg_user', JSON.stringify(sessionUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hg_user');
    localStorage.removeItem('hg_selected_hospital');
  };

  const updateProfile = (updatedData) => {
    if (!user) return { success: false, message: 'No active session' };
    
    // Update active session state
    const sessionUser = { ...user, ...updatedData };
    setUser(sessionUser);
    localStorage.setItem('hg_user', JSON.stringify(sessionUser));

    // Update in registered users registry as well to maintain sync
    const updatedRegistry = registeredUsers.map((u) => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, ...updatedData };
      }
      return u;
    });
    setRegisteredUsers(updatedRegistry);
    localStorage.setItem('hg_registered_users', JSON.stringify(updatedRegistry));

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
