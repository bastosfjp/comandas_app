import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField, Button, Box, MenuItem, InputAdornment, CircularProgress, Typography,
} from "@mui/material";
import {
  Badge, Phone, Lock, Group, Numbers, Person,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../common/PageLayout";
import { useValidationRules } from "../../hooks/useValidationRules";
import useMasks from "../../hooks/useMasks";
import { funcionarioService } from "../../services/funcionarioService";
import showSnackbar from "../../utils/snackbar";

const grupos = [
  { value: 1, label: "Administrador" },
  { value: 2, label: "Gerente" },
  { value: 3, label: "Atendente" },
  { value: 4, label: "Cozinha" },
];

const FuncionarioForm = () => {
  const { id, opr } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit, setValue, formState: { errors, dirtyFields }, reset } = useForm();
  const rules = useValidationRules();
  const { applyCpfMask, applyPhoneMask, cleanCpf, cleanPhone } = useMasks();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const nomeRef = useRef(null);
  const isReadOnly = opr === "view";
  const title = opr === "view" ? `Visualizar Funcionário: ${id}` : id ? `Editar Funcionário: ${id}` : "Novo Funcionário";

  useEffect(() => {
    setTimeout(() => nomeRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    const loadFuncionario = async () => {
      if (!id) {
        setLoadingData(false);
        return;
      }
      try {
        setLoadingData(true);
        const data = await funcionarioService.getById(id);
        reset(data);
      } catch (error) {
        showSnackbar("Erro ao carregar funcionário", "error");
        navigate("/funcionarios");
      } finally {
        setLoadingData(false);
      }
    };
    loadFuncionario();
  }, [id, navigate, reset]);

  const handleCancel = () => {
    navigate("/funcionarios");
  };

  const onSubmit = async (data) => {
    if (isReadOnly) return;
    try {
      setLoading(true);
      let response;
      const payload = {
        ...data,
        cpf: cleanCpf(data.cpf),
        telefone: cleanPhone(data.telefone),
      };
      if (id) {
        const changedData = {};
        Object.keys(dirtyFields).forEach((key) => {
          if (dirtyFields[key]) changedData[key] = payload[key] ?? data[key];
        });
        if (Object.keys(changedData).length === 0) {
          showSnackbar("Nenhuma alteração detectada", "info");
          return;
        }
        response = await funcionarioService.update(id, changedData);
        showSnackbar("Funcionário atualizado com sucesso!", "success");
      } else {
        response = await funcionarioService.create(payload);
        showSnackbar("Funcionário criado com sucesso!", "success");
      }
      const savedId = response?.id ?? response?._id;
      const isSuccess = !!savedId || response?.success === true;
      if (!isSuccess) {
        throw new Error("Erro ao salvar funcionário.");
      }
      navigate("/funcionarios");
    } catch (error) {
      const message = error.apiMessage || "Erro ao salvar funcionário";
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": { borderColor: "#f59e0b", borderWidth: 2 },
      "&.Mui-focused": { backgroundColor: "rgba(245,158,11,0.04)" },
    },
    "& label.Mui-focused": { color: "#f59e0b" },
  };

  return (
    <PageLayout title={title}>
      {loadingData ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {isReadOnly && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Todos os campos estão em modo somente leitura.
            </Typography>
          )}

          <Controller
            name="nome" control={control} defaultValue=""
            rules={rules.nome}
            render={({ field }) => (
              <TextField
                {...field} inputRef={nomeRef}
                disabled={isReadOnly}
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
                disabled={isReadOnly}
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
                disabled={isReadOnly}
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
                disabled={isReadOnly}
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
                disabled={isReadOnly}
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
            rules={id ? {} : rules.senha}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={isReadOnly}
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
            <Button onClick={handleCancel} color="inherit">
              Cancelar
            </Button>
            {!isReadOnly && (
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Salvando..." : id ? "Atualizar" : "Cadastrar"}
              </Button>
            )}
          </Box>
        </Box>
      )}
    </PageLayout>
  );
};

export default FuncionarioForm;
