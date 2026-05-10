import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import RestrictedRoute from "./RestrictedRoute";
import { CircularProgress, Box } from "@mui/material";

// Lazy loading para code-splitting e melhor performance
const Dashboard = lazy(() => import("../components/pages/Dashboard"));
const FuncionarioList = lazy(() => import("../components/pages/FuncionarioList"));
const FuncionarioForm = lazy(() => import("../components/pages/FuncionarioForm"));
const ClienteList = lazy(() => import("../components/pages/ClienteList"));
const ClienteForm = lazy(() => import("../components/pages/ClienteForm"));
const ProdutoList = lazy(() => import("../components/pages/ProdutoList"));
const ProdutoForm = lazy(() => import("../components/pages/ProdutoForm"));
const ComandaList = lazy(() => import("../components/pages/ComandaList"));
const ComandaForm = lazy(() => import("../components/pages/ComandaForm"));
const Caixa = lazy(() => import("../components/pages/Caixa"));
const Perfil = lazy(() => import("../components/pages/Perfil"));
const LoginForm = lazy(() => import("../components/forms/LoginForm"));
const NotFound = lazy(() => import("../components/pages/NotFound"));

const Loading = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
    <CircularProgress color="secondary" />
  </Box>
);

const priv = (el) => <PrivateRoute>{el}</PrivateRoute>;

const AppRoutes = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rota pública */}
      <Route path="/produtos/publica" element={<ProdutoList />} />

      {/* Rota restrita - só sem login */}
      <Route path="/login" element={<RestrictedRoute><LoginForm /></RestrictedRoute>} />

      {/* Rotas protegidas */}
      <Route path="/home" element={priv(<Dashboard />)} />
      <Route path="/funcionarios" element={priv(<FuncionarioList />)} />
      <Route path="/funcionario" element={priv(<FuncionarioForm />)} />
      <Route path="/funcionario/:id" element={priv(<FuncionarioForm />)} />
      <Route path="/clientes" element={priv(<ClienteList />)} />
      <Route path="/cliente" element={priv(<ClienteForm />)} />
      <Route path="/cliente/:id" element={priv(<ClienteForm />)} />
      <Route path="/produtos" element={priv(<ProdutoList />)} />
      <Route path="/produto" element={priv(<ProdutoForm />)} />
      <Route path="/produto/:id" element={priv(<ProdutoForm />)} />
      <Route path="/comandas" element={priv(<ComandaList />)} />
      <Route path="/comanda" element={priv(<ComandaForm />)} />
      <Route path="/comanda/:id" element={priv(<ComandaForm />)} />
      <Route path="/caixa" element={priv(<Caixa />)} />
      <Route path="/perfil" element={priv(<Perfil />)} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;