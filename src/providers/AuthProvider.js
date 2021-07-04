import React, {createContext, useState, useContext} from 'react';

import Loading from '../components/Loading';
export const AuthContext = createContext();

export default function AuthProvider({children}) {
  const [user, setCurrentUser] = useState();
  const [loading, setLoading] = useState(false);

  if (loading) return <Loading />;

  return (
    <AuthContext.Provider value={{user, setCurrentUser}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const {user, setCurrentUser} = useContext(AuthContext);
  const isSigned = !!user;

  return {user, setCurrentUser, isSigned};
};
