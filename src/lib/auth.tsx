import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase'; // we will create this next
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: FirebaseUser | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Evaluate if user is admin. Based on rules:
        // admin is mdsamirmolla87@gmail.com OR exists in admins DB
        let isUserAdmin = currentUser.email === 'mdsamirmolla87@gmail.com';
        
        if (!isUserAdmin) {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            if (adminDoc.exists()) {
              isUserAdmin = true;
            }
          } catch (e) {
            console.error(e);
          }
        }
        setIsAdmin(isUserAdmin);
        setUser(currentUser);
      } else {
        setIsAdmin(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
