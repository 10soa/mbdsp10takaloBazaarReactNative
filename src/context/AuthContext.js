import React, {createContext, useState, useEffect} from 'react';
import {getToken} from '../service/SessionService';
import {logout} from '../service/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  const logoutUser = async navigation => {
    try {
      await logout(navigation);
      setIsAuthenticated(false);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{isAuthenticated, setIsAuthenticated, logoutUser}}>
      {children}
    </AuthContext.Provider>
  );
};
