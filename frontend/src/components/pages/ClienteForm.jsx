import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, InputAdornment, CircularProgress, Typography } from "@mui/material";
import { Person, Badge, Phone } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../common/PageLayout";
import { useValidationRules } from "../../hooks/useValidationRules";
import useMasks from "../../hooks/useMasks";
import { clienteService } from "../../services/clienteService";
import showSnackbar from "../../utils/snackbar";

const ClienteForm = () => {
  const { id, opr } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors, dirtyFields }, reset } = useForm();
  const rules = useValidationRules();
  const { applyCpfMask, applyPhoneMask, cleanCpf, cleanPhone } = useMasks();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const nomeRef = useRef(null);
  const isReadOnly = opr === "view";
  const title = opr === "view" ? `Visualizar Cliente: ${id}` : id ? `Editar Cliente: ${id}` : "Novo Cliente";

  useEffect(() => {
    setTimeout(() => nomeRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    const loadCliente = async () => {
      if (!id) {
        setLoadingData(false);
        return;
      }
      try {
        setLoadingData(true);
        const data = await clienteService.getById(id);
        reset(data);
      } catch (error) {
        showSnackbar("Erro ao carregar cliente", "error");
        navigate("/clientes");
      } finally {
        setLoadingData(false);
      }
    };
    loadCliente();
  }, [id, navigate, reset]);

  const handleCancel = () => navigate("/clientes");

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
        response = await clienteService.update(id, changedData);
        showSnackbar("Cliente atualizado com sucesso!", "success");
      } else {
        response = await clienteService.create(payload);
        showSnackbar("Cliente criado com sucesso!", "success");
      }
      const savedId = response?.id ?? response?._id;
      const isSuccess = !!savedId || response?.success === true;
      if (!isSuccess) {
        throw new Error("Erro ao salvar cliente.");
      }
      navigate("/clientes");
    } catch (error) {
      const message = error.apiMessage || "Erro ao salvar cliente";
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
                disabled={isReadOnly}
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
                disabled={isReadOnly}
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

export default ClienteForm;
