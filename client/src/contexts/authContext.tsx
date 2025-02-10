import { createContext, ReactNode, useContext, useState } from "react";
import { IUser } from "../types/types";
import { api } from "../config/axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface AuthContextType {
  isAuthenticated: string | null;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<string | null>>;
  userInfo: IUser | null;
  setUserInfo: React.Dispatch<React.SetStateAction<IUser | null>>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<string | null>(
    localStorage.getItem("isAuthenticated")
  );
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const navigate = useNavigate();

  async function logout() {
    const response = await api.get("/auth/google/logout");

    if (response.data) {
      localStorage.removeItem("isAuthenticated");
      toast.success("Logged out!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/");
      setUserInfo(null);
    } else {
      toast.error("Something went wrong while logging out!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
