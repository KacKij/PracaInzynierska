import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: any;
  userInfo: UserInfo | null;
  fetchUserInfo: () => Promise<void>;

  userAddress: UserAddress | null;
  fetchUserAddress: () => Promise<void>;

  hasRole: (role: string) => boolean;
  hasPrivilege: (privilege: string) => boolean;

  loading: boolean;
}

interface UserInfo {
    firstname: string;
    lastname: string;
    email: string;
    occupation: string;
    phoneNumber: string;
    roles: String[];
    privileges: String[];
}

interface UserAddress {
    street: string;
    city: string;
    zipCode: string;
    state: string;
    country: string;
    streetNumber: string;
    apartmentNumber: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userAddress, setUserAddress] = useState<UserAddress | null>(null);

  const [loading, setLoading] = useState(true);

  const hasRole = (role: string) => {
    return userInfo?.roles?.includes(role) ?? false;
  };
  
  const hasPrivilege = (privilege: string) => {
    return userInfo?.privileges?.includes(privilege) ?? false;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const fetchUserInfo = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    try {
        const res = await fetch("http://localhost:8080/api/dashboard/me", 
            { headers: 
                { Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error("Failed to fetch user info");
        }

        const data = await res.json();
        setUserInfo(data);
    } catch (error) {
        console.error("Error fetch user info", error); 
    }
};

  const fetchUserAddress = async () => {

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    try {
        const res = await fetch("http://localhost:8080/api/dashboard/me/address", 
            {   method: "GET",
                headers: 
                { Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch user address");
        }

        const data = await res.json();
        setUserAddress(data);
    } catch (error) {
        console.error("Error fetch user address", error);
    }
};

useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded: any = jwtDecode(token);
    setUser(decoded);
    setIsAuthenticated(true);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout,
        user, userInfo, fetchUserInfo,
        loading,
        userAddress, fetchUserAddress,
        hasRole, hasPrivilege
     }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};