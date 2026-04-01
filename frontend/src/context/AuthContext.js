import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            token,
            email: decoded.sub,       
            role: decoded.role,        
            userId: localStorage.getItem('userId'),
          });
        } else {
          
          localStorage.clear();
        }
      } catch (e) {
        console.error('Invalid token:', e);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', String(userId));

    const decoded = jwtDecode(token);

    
    setUser({
      token,
      email: decoded.sub,
      role: decoded.role,   
      userId: userId,
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);