import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, InputAdornment, Typography } from "@mui/material";
import { PhotoCamera as PhotoCameraIcon, ShoppingBag, Description, AttachMoney } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageLayout from "../common/PageLayout";
import { useValidationRules } from "../../hooks/useValidationRules";

const ProdutoForm = () => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm();
  const validationRules = useValidationRules();
  const navigate = useNavigate();
  const nomeRef = useRef(null);

  useEffect(() => {
    setTimeout(() => nomeRef.current?.focus(), 100);
  }, []);

  const onSubmit = (data) => console.log("Dados do produto:", data);

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": { borderColor: "#f59e0b", borderWidth: 2 },
      "&.Mui-focused": { backgroundColor: "rgba(245,158,11,0.04)" },
    },
    "& label.Mui-focused": { color: "#f59e0b" },
  };

  const descricaoValue = watch("descricao") || "";

  return (
    <PageLayout title="Dados do Produto">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

        <Controller
          name="nome" control={control} defaultValue=""
          rules={validationRules.nome}
          render={({ field }) => (
            <TextField
              {...field} inputRef={nomeRef}
              label="Nome do produto" fullWidth margin="normal"
              placeholder="Ex: Hambúrguer Artesanal"
              title="Nome do produto como aparecerá no cardápio"
              inputProps={{ maxLength: 100 }}
              error={!!errors.nome}
              helperText={errors.nome?.message || `${field.value?.length || 0}/100`}
              InputProps={{ startAdornment: <InputAdornment position="start"><ShoppingBag fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            />
          )}
        />

        <Controller
          name="descricao" control={control} defaultValue=""
          rules={validationRules.descricao}
          render={({ field }) => (
            <TextField
              {...field}
              label="Descrição" fullWidth margin="normal"
              placeholder="Ex: Pão brioche, carne 180g, queijo, alface e tomate"
              title="Descrição do produto com ingredientes ou detalhes"
              multiline rows={3}
              inputProps={{ maxLength: 200 }}
              error={!!errors.descricao}
              helperText={errors.descricao?.message || `${descricaoValue.length}/200`}
              InputProps={{ startAdornment: <InputAdornment position="start"><Description fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            />
          )}
        />

        <Controller
          name="valor_unitario" control={control} defaultValue=""
          rules={validationRules.valor_unitario}
          render={({ field }) => (
            <TextField
              {...field}
              label="Valor Unitário (R$)" fullWidth margin="normal"
              placeholder="0,00"
              title="Valor de venda do produto em reais"
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              error={!!errors.valor_unitario}
              helperText={errors.valor_unitario?.message}
              InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney fontSize="small" /></InputAdornment> }}
              sx={fieldSx}
            />
          )}
        />

        {/* Upload de foto */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Foto do Produto (opcional)
          </Typography>
          <input id="foto-upload" type="file" accept="image/*" style={{ display: "none" }} />
          <label htmlFor="foto-upload">
            <Button
              variant="outlined" component="span"
              startIcon={<PhotoCameraIcon />}
              title="Selecionar foto do produto"
              fullWidth
              sx={{ borderColor: "#cbd5e1", "&:hover": { borderColor: "#f59e0b" } }}
            >
              Selecionar Foto
            </Button>
          </label>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          <Button onClick={() => navigate("/produtos")} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained">Cadastrar</Button>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default ProdutoForm;