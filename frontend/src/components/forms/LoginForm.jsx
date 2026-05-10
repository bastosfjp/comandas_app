import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import { RestaurantMenu as MenuIcon, Lock, Person } from "@mui/icons-material";
import useValidationRules from "../../hooks/useValidationRules";

const LoginForm = () => {
  const validationRules = useValidationRules();
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const loginRef = useRef(null);

  // Foco automático no campo login ao abrir a tela
  useEffect(() => {
    if (loginRef.current) loginRef.current.focus();
  }, []);

  const onSubmit = (data) => {
    login(data.cpf, data.senha);
  };

  const focusedFieldSx = {
    "& .MuiOutlinedInput-root": {
      transition: "box-shadow 0.2s",
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.25)",
        "& fieldset": { borderColor: "#f59e0b", borderWidth: 2 },
      },
    },
    "& label.Mui-focused": { color: "#f59e0b" },
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Paper elevation={8} sx={{ p: { xs: 3, sm: 4 }, maxWidth: 420, width: "100%", borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: "#f59e0b", mx: "auto", mb: 2 }}>
            <MenuIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", mb: 0.5 }}>
            Comandas do Zé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Faça login para acessar o sistema
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="cpf"
            control={control}
            defaultValue=""
            rules={validationRules.login}
            render={({ field }) => (
              <TextField
                {...field}
                inputRef={loginRef}
                fullWidth
                label="Login"
                margin="normal"
                placeholder="Digite seu login (ex: abc)"
                title="Informe seu login de acesso ao sistema"
                autoComplete="username"
                inputProps={{ maxLength: 11 }}
                error={!!errors.cpf}
                helperText={errors.cpf?.message || `${field.value?.length || 0}/11 caracteres`}
                slotProps={{ input: { startAdornment: <Person sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} /> } }}
                sx={{ ...focusedFieldSx, mb: 1 }}
              />
            )}
          />
          <Controller
            name="senha"
            control={control}
            defaultValue=""
            rules={validationRules.senha}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Senha"
                type="password"
                margin="normal"
                placeholder="Digite sua senha"
                title="Informe sua senha — mínimo 6 caracteres"
                autoComplete="current-password"
                error={!!errors.senha}
                helperText={errors.senha?.message}
                slotProps={{ input: { startAdornment: <Lock sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} /> } }}
                sx={{ ...focusedFieldSx, mb: 2 }}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ py: 1.5, mt: 1, fontWeight: 700, fontSize: "1rem", background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", "&:hover": { background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" } }}
          >
            Entrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;