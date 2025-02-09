import { createContext, ReactNode, useContext, useState } from "react";
import { IUser } from "../types/types";
import { api } from "../config/axios";
import { useNavigate } from "react-router";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: IUser | null;
  setUserInfo: React.Dispatch<React.SetStateAction<IUser | null>>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const navigate = useNavigate();

  async function logout() {
    const response = await api.get("/auth/google/logout");

    if (response.data) {
      navigate("/");
      setUserInfo(null);
      setIsAuthenticated(false);
    } else {
      console.log(response);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userInfo,
        setUserInfo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within provider");

  return context;
};
