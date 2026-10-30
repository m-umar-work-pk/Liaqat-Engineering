import React, { createContext, useContext, useReducer, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../config/firebase";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload.user, userData: action.payload.userData, loading: false };
    case "LOGOUT":
      return { ...state, user: null, userData: null, loading: false };
    default: return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, userData: null, loading: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        dispatch({ type: "SET_USER", payload: { user, userData: userDoc.exists() ? userDoc.data() : null } });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => { await signOut(auth); dispatch({ type: "LOGOUT" }); };

  return <AuthContext.Provider value={{ ...state, handleLogout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);