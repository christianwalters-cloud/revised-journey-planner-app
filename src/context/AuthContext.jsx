import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../../supabase-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    // Listens for live log-ins, log-outs, or password recovery events in real time
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false); // Session resolution complete

      if (event === "PASSWORD_RECOVERY") {
        setShowResetModal(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email, password, options = {}) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: options.options || options,
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    isLoggedIn: !!user,
    login,
    signUp,
    logout,
    loading,
    showResetModal,
    setShowResetModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
