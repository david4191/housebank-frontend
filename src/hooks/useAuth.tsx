import React from 'react';
import { AuthContext } from '../context/AuthContext.tsx';

// @ts-ignore
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context)
    throw new Error('AuthContext must be placed within AuthProvider');
  return context;
};

export default useAuth;
