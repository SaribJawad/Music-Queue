import { createContext, ReactNode, useContext, useState } from "react";
import { IUser } from "../types/types";
import { api } from "../config/axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface AuthContextType {
  isAuthenticated: "true" | "false" | null;
  setIsAuthenticated: React.Dispatch<
    React.SetStateAction<"true" | "false" | null>
  >;
  userInfo: IUser | null;
  setUserInfo: React.Dispatch<React.SetStateAction<IUser | null>>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<
    "true" | "false" | null | null
  >(localStorage.getItem("isAuthenticated") as "true" | "false");
  const [userInfo, setUserInfo] = useState<IUser | null>(null);

  const navigate = useNavigate();

  async function logout() {
    try {
      const response = await api.get("/auth/google/logout");

      if (response.status === 200) {
        setIsAuthenticated("false");
        localStorage.setItem("isAuthenticated", "false");
        localStorage.removeItem("redirectUrl");
        toast.success("Logged out!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/");
      }
    } catch (error) {
      setIsAuthenticated("true");
      localStorage.setItem("isAuthenticated", "true");
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
