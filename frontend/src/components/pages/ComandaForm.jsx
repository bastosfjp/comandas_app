import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, MenuItem, InputAdornment } from "@mui/material";
import { Receipt, Person, SupervisorAccount } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageLayout from "../common/PageLayout";
import { useValidationRules } from "../../hooks/useValidationRules";

const statusOpcoes = [
  { value: 1, label: "Aberta" },
  { value: 2, label: "Em atendimento" },
  { value: 3, label: "Fechada" },
  { value: 4, label: "Cancelada" },
];

// Mock de funcionários e clientes para o select
const funcionariosMock = [
  { id: 1, nome: "João Pedro Bastos Fernandes" },
  { id: 2, nome: "Darth Vader de Lima" },
];
const clientesMock = [
  { id: 1, nome: "Tio Lu Coelho da Silva Sauro" },
  { id: 2, nome: "Shaekespeare da Silva" },
];

const ComandaForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const rules = useValidationRules();
  const navigate = useNavigate();
  const comandaRef = useRef(null);

  useEffect(() => {
    setTimeout(() => comandaRef.current?.focus(), 100);
  }, []);

  const onSubmit = (data) => console.log("Dados da comanda:", data);

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": { borderColor: "#f59e0b", borderWidth: 2 },
      "&.Mui-focused": { backgroundColor: "rgba(245,158,11,0.04)" },
    },
    "& label.Mui-focused": { color: "#f59e0b" },
  };

  return (
    <PageLayout title="Nova Comanda">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

        <Controller
          name="comanda" control={control} defaultValue=""
          rules={rules.comanda}
          render={({ field }) => (
            <TextField
              {...field} inputRef={comandaRef}
              label="Número da Comanda" fullWidth margin="normal"
              placeholder="Ex: 001"
              title="Número identificador da comanda"
              inputProps={{ maxLength: 50 }}
              error={!!errors.comanda} helperText={errors.comanda?.message}
              InputProps={{ startAdornment: <InputAdornment position="start"><Receipt fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            />
          )}
        />

        <Controller
          name="status" control={control} defaultValue={1}
          rules={{ required: "Status é obrigatório" }}
          render={({ field }) => (
            <TextField
              {...field} select
              label="Status" fullWidth margin="normal"
              title="Status atual da comanda"
              error={!!errors.status} helperText={errors.status?.message}
              sx={fieldSx}
            >
              {statusOpcoes.map((s) => (
                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="funcionario_id" control={control} defaultValue=""
          rules={{ required: "Funcionário responsável é obrigatório" }}
          render={({ field }) => (
            <TextField
              {...field} select
              label="Funcionário Responsável" fullWidth margin="normal"
              title="Funcionário que abriu a comanda"
              error={!!errors.funcionario_id} helperText={errors.funcionario_id?.message}
              InputProps={{ startAdornment: <InputAdornment position="start"><SupervisorAccount fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            >
              {funcionariosMock.map((f) => (
                <MenuItem key={f.id} value={f.id}>{f.nome}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="cliente_id" control={control} defaultValue=""
          render={({ field }) => (
            <TextField
              {...field} select
              label="Cliente (opcional)" fullWidth margin="normal"
              title="Cliente associado à comanda (pode ficar em branco)"
              InputProps={{ startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            >
              <MenuItem value=""><em>Sem cliente</em></MenuItem>
              {clientesMock.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          <Button onClick={() => navigate("/comandas")} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained">Abrir Comanda</Button>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default ComandaForm;