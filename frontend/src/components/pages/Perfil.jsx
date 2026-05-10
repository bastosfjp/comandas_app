import { Box, Typography, Avatar, Card, CardContent, Divider, Chip } from "@mui/material";
import { Person, Badge, Phone, Group, AdminPanelSettings } from "@mui/icons-material";
import PageLayout from "../common/PageLayout";
import { useAuth } from "../../context/AuthContext";

// Imagem de perfil placeholder - substituir pelo rosto do aluno
const FOTO_PERFIL = "icon.jpeg";

const grupos = { 1: "Administrador", 2: "Gerente", 3: "Atendente", 4: "Cozinha" };

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}>
    <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body1" fontWeight={500}>{value}</Typography>
    </Box>
  </Box>
);

function Perfil() {
  const { usuarioLogado } = useAuth();
  const usuario = usuarioLogado || { nome: "Administrador", cpf: "abc", matricula: "0001", grupo: 1 };

  return (
    <PageLayout title="Meu Perfil" maxWidth="md">
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>

        {/* Foto e nome */}
        <Card elevation={2} sx={{ minWidth: { md: 220 }, textAlign: "center" }}>
          <CardContent sx={{ p: 3 }}>
            <Avatar
              src={FOTO_PERFIL}
              alt="Foto de perfil"
              sx={{ width: 120, height: 120, mx: "auto", mb: 2, border: "4px solid #f59e0b" }}
            />
            <Typography variant="h6" fontWeight={700}>{usuario.nome}</Typography>
            <Chip
              icon={<AdminPanelSettings fontSize="small" />}
              label={grupos[usuario.grupo] || "Funcionário"}
              color="secondary"
              sx={{ mt: 1 }}
            />
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Matrícula: {usuario.matricula}
            </Typography>
          </CardContent>
        </Card>

        {/* Dados */}
        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={1}>Informações do funcionário</Typography>
            <Divider sx={{ mb: 1 }} />
            <InfoRow icon={<Person />} label="Nome completo" value={usuario.nome} />
            <Divider />
            <InfoRow icon={<Badge />} label="CPF / Login" value={usuario.cpf} />
            <Divider />
            <InfoRow icon={<Group />} label="Matrícula" value={usuario.matricula} />
            <Divider />
            <InfoRow icon={<AdminPanelSettings />} label="Grupo de acesso" value={grupos[usuario.grupo] || "-"} />
          </CardContent>
        </Card>
      </Box>
    </PageLayout>
  );
}

export default Perfil;