import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axiosInstance from "../api/axiosInstance";

interface AuthContextType {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
  setRefetch: (refetch: boolean) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        if (response?.data?.data?.user) {
          setUser(response.data?.data?.user);
        }
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
    setRefetch(false);
  }, [refetch]);

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, setRefetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UseAuth must be used within AuthProvider");
  }
  return context;
};
