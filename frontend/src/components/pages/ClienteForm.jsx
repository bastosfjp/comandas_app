import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, InputAdornment } from "@mui/material";
import { Person, Badge, Phone } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageLayout from "../common/PageLayout";
import { useValidationRules } from "../../hooks/useValidationRules";
import useMasks from "../../hooks/useMasks";

const ClienteForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const rules = useValidationRules();
  const { applyCpfMask, applyPhoneMask } = useMasks();
  const navigate = useNavigate();
  const nomeRef = useRef(null);

  useEffect(() => {
    setTimeout(() => nomeRef.current?.focus(), 100);
  }, []);

  const onSubmit = (data) => console.log("Dados do cliente:", data);

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": { borderColor: "#f59e0b", borderWidth: 2 },
      "&.Mui-focused": { backgroundColor: "rgba(245,158,11,0.04)" },
    },
    "& label.Mui-focused": { color: "#f59e0b" },
  };

  return (
    <PageLayout title="Dados do Cliente">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

        <Controller
          name="nome" control={control} defaultValue=""
          rules={rules.nome}
          render={({ field }) => (
            <TextField
              {...field} inputRef={nomeRef}
              label="Nome completo" fullWidth margin="normal"
              placeholder="Ex: Ana Paula Costa"
              title="Nome completo do cliente"
              inputProps={{ maxLength: 100 }}
              error={!!errors.nome}
              helperText={errors.nome?.message || `${field.value?.length || 0}/100`}
              InputProps={{ startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment> }}
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
              title="CPF do cliente (somente números)"
              inputProps={{ maxLength: 14 }}
              onChange={(e) => field.onChange(applyCpfMask(e.target.value))}
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
              title="Telefone do cliente com DDD"
              inputProps={{ maxLength: 15 }}
              onChange={(e) => field.onChange(applyPhoneMask(e.target.value))}
              error={!!errors.telefone} helperText={errors.telefone?.message}
              InputProps={{ startAdornment: <InputAdornment position="start"><Phone fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            />
          )}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          <Button onClick={() => navigate("/clientes")} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained">Cadastrar</Button>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default ClienteForm;