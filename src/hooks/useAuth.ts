import { api } from "../config/axios";

export const useAuth = () => {
  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } catch (err) {
      throw new Error("Login failed");
    }
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return { login, isAuthenticated, logout };
};
