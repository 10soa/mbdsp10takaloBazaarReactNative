import React, {createContext, useState, useEffect} from 'react';
import {getToken, getUserFromToken, getUserId} from '../service/SessionService';
import {logout} from '../service/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userID, setuserID] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsAuthenticated(!!token);
      if (token) {
        const user = await getUserId();
        setuserID(user);
      }
    };

    checkAuth();
  }, []);

  const logoutUser = async navigation => {
    try {
      await logout(navigation);
      setIsAuthenticated(false);
      setuserID('');
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        logoutUser,
        userID,
        setuserID,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
