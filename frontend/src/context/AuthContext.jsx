import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.token) {
      localStorage.setItem("vk_token", data.token);
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    }
    setUser({ id: data.id, email: data.email, name: data.name, role: data.role });
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}
    localStorage.removeItem("vk_token");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  // restore token on mount
  useEffect(() => {
    const t = localStorage.getItem("vk_token");
    if (t) api.defaults.headers.common.Authorization = `Bearer ${t}`;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
