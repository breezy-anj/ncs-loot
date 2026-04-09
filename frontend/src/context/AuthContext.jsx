import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("loot_token");
    const savedUser = localStorage.getItem("loot_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem("loot_token", newToken);
    localStorage.setItem("loot_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("loot_token");
    localStorage.removeItem("loot_user");
    setToken(null);
    setUser(null);
  };

  const syncUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("loot_user", JSON.stringify(updatedUserData));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, syncUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
