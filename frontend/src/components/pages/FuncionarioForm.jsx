import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField, Button, Box, MenuItem, InputAdornment,
} from "@mui/material";
import {
  Badge, Phone, Lock, Group, Numbers, Person,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageLayout from "../common/PageLayout";
import { useValidationRules } from "../../hooks/useValidationRules";
import useMasks from "../../hooks/useMasks";

const grupos = [
  { value: 1, label: "Administrador" },
  { value: 2, label: "Gerente" },
  { value: 3, label: "Atendente" },
  { value: 4, label: "Cozinha" },
];

const FuncionarioForm = () => {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
  const rules = useValidationRules();
  const { applyCpfMask, applyPhoneMask } = useMasks();
  const navigate = useNavigate();
  const nomeRef = useRef(null);

  // Foco inicial no campo nome
  useEffect(() => {
    setTimeout(() => nomeRef.current?.focus(), 100);
  }, []);

  const onSubmit = (data) => {
    console.log("Dados do funcionário:", data);
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": { borderColor: "#f59e0b", borderWidth: 2 },
      "&.Mui-focused": { backgroundColor: "rgba(245,158,11,0.04)" },
    },
    "& label.Mui-focused": { color: "#f59e0b" },
  };

  return (
    <PageLayout title="Dados do Funcionário">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

        <Controller
          name="nome" control={control} defaultValue=""
          rules={rules.nome}
          render={({ field }) => (
            <TextField
              {...field} inputRef={nomeRef}
              label="Nome completo" fullWidth margin="normal"
              placeholder="Ex: João da Silva"
              title="Nome completo do funcionário"
              inputProps={{ maxLength: 100 }}
              error={!!errors.nome} helperText={errors.nome?.message || `${field.value?.length || 0}/100`}
              InputProps={{ startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            />
          )}
        />

        <Controller
          name="matricula" control={control} defaultValue=""
          rules={rules.matricula}
          render={({ field }) => (
            <TextField
              {...field}
              label="Matrícula" fullWidth margin="normal"
              placeholder="Ex: 00001"
              title="Número de matrícula do funcionário"
              inputProps={{ maxLength: 11 }}
              error={!!errors.matricula} helperText={errors.matricula?.message}
              InputProps={{ startAdornment: <InputAdornment position="start"><Numbers fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            />
          )}
        />

        <Controller
          name="cpf" control={control} defaultValue=""
          rules={rules.cpf}
          render={({ field }) => (
            <TextField
              {...field}
              label="CPF" fullWidth margin="normal"
              placeholder="000.000.000-00"
              title="CPF do funcionário (somente números)"
              inputProps={{ maxLength: 14 }}
              onChange={(e) => {
                const masked = applyCpfMask(e.target.value);
                field.onChange(masked);
              }}
              error={!!errors.cpf} helperText={errors.cpf?.message}
              InputProps={{ startAdornment: <InputAdornment position="start"><Badge fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            />
          )}
        />

        <Controller
          name="telefone" control={control} defaultValue=""
          rules={rules.telefone}
          render={({ field }) => (
            <TextField
              {...field}
              label="Telefone" fullWidth margin="normal"
              placeholder="(00) 00000-0000"
              title="Telefone do funcionário com DDD"
              inputProps={{ maxLength: 15 }}
              onChange={(e) => {
                const masked = applyPhoneMask(e.target.value);
                field.onChange(masked);
              }}
              error={!!errors.telefone} helperText={errors.telefone?.message}
              InputProps={{ startAdornment: <InputAdornment position="start"><Phone fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            />
          )}
        />

        <Controller
          name="grupo" control={control} defaultValue=""
          rules={rules.grupo}
          render={({ field }) => (
            <TextField
              {...field} select
              label="Grupo / Perfil" fullWidth margin="normal"
              title="Grupo de permissão do funcionário"
              error={!!errors.grupo} helperText={errors.grupo?.message}
              InputProps={{ startAdornment: <InputAdornment position="start"><Group fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            >
              {grupos.map((g) => (
                <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="senha" control={control} defaultValue=""
          rules={rules.senha}
          render={({ field }) => (
            <TextField
              {...field}
              label="Senha" type="password" fullWidth margin="normal"
              placeholder="Mínimo 6 caracteres"
              title="Senha de acesso ao sistema"
              inputProps={{ maxLength: 50 }}
              error={!!errors.senha} helperText={errors.senha?.message}
              InputProps={{ startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            />
          )}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          <Button onClick={() => navigate("/funcionarios")} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Cadastrar
          </Button>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default FuncionarioForm;