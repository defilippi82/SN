import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, DocumentData, DocumentSnapshot } from "firebase/firestore";

interface UserData {
  // Definir la estructura de los datos del usuario
  nombre: string;
  email: string;
  // Añadir más campos según sea necesario
}

interface ContextProps {
  user: User | null;
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
}

export const UserContext = createContext<ContextProps>({
  user: null,
  userData: null,
  setUserData: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const db = getFirestore();
          const docRef = doc(db, "usuarios", firebaseUser.uid);
          const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
