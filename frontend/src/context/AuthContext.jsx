import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import showSnackbar from "../utils/snackbar";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("loginRealizado") === "true";
  });
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const saved = sessionStorage.getItem("usuarioLogado");
    return saved ? JSON.parse(saved) : null;
  });

  // loading é false pois sessionStorage é síncrono
  const loading = false;

  const navigate = useNavigate();

  const login = (cpf, senha) => {
    if (cpf === "abc" && senha === "bolinhas") {
      const usuario = { nome: "Administrador", cpf, grupo: 1, matricula: "0001" };
      setIsAuthenticated(true);
      setUsuarioLogado(usuario);
      sessionStorage.setItem("loginRealizado", "true");
      sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      navigate("/home");
    } else {
      showSnackbar("Usuário ou senha inválidos!", "error");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsuarioLogado(null);
    sessionStorage.removeItem("loginRealizado");
    sessionStorage.removeItem("usuarioLogado");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, usuarioLogado }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);