import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("admin_token"));

  const login = (token) => {
    localStorage.setItem("admin_token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token]);
  

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
