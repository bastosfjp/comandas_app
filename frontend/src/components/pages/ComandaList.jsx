import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Card, CardContent, Typography, Box, Divider, Chip,
} from "@mui/material";
import { FiberNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageLayout from "../common/PageLayout";
import ActionButtons from "../common/ActionButtons";
import showConfirm from "../../utils/confirm";
import showSnackbar from "../../utils/snackbar";

const statusMap = { 1: "Aberta", 2: "Em atendimento", 3: "Fechada", 4: "Cancelada" };
const statusColor = { 1: "success", 2: "warning", 3: "default", 4: "error" };

const comandas = [
  { id: 1, comanda: "001", data_hora: "2026-05-10T10:00:00", status: 1, funcionario: { nome: "João Pedro Bastos Fernandes" }, cliente: { nome: "Tio Lu Coelho" } },
  { id: 2, comanda: "002", data_hora: "2026-05-10T11:30:00", status: 2, funcionario: { nome: "Tio Lu" }, cliente: null },
  { id: 3, comanda: "003", data_hora: "2026-05-10T09:15:00", status: 3, funcionario: { nome: "Batman de Pilares" }, cliente: { nome: "Batman de Pilares" } },
];

const formatDT = (dt) =>
  new Date(dt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

function ComandaList() {
  const navigate = useNavigate();

  const handleView = (item) => showSnackbar(`Comanda ${item.comanda}`, "info");
  const handleEdit = (item) => navigate(`/comanda/${item.id}`);
  const handleDelete = (item) =>
    showConfirm("Cancelar comanda", `Cancelar comanda ${item.comanda}?`, () =>
      showSnackbar(`Comanda ${item.comanda} cancelada!`, "success")
    );

  const actions = (
    <Button
      variant="contained" color="secondary"
      onClick={() => navigate("/comanda")}
      startIcon={<FiberNew />}
      sx={{ fontWeight: 600 }}
    >
      Nova
    </Button>
  );

  const renderDesktop = (c) => (
    <TableRow key={c.id} hover>
      <TableCell>{c.id}</TableCell>
      <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>#{c.comanda}</TableCell>
      <TableCell>{formatDT(c.data_hora)}</TableCell>
      <TableCell>{c.funcionario?.nome || "-"}</TableCell>
      <TableCell>{c.cliente?.nome || <em style={{ color: "#94a3b8" }}>Sem cliente</em>}</TableCell>
      <TableCell>
        <Chip label={statusMap[c.status]} color={statusColor[c.status]} size="small" />
      </TableCell>
      <TableCell>
        <ActionButtons item={c} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      </TableCell>
    </TableRow>
  );

  const renderMobile = (c) => (
    <Card key={c.id} sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Comanda #{c.comanda}</Typography>
          <Chip label={statusMap[c.status]} color={statusColor[c.status]} size="small" />
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" color="text.secondary">Data: <strong>{formatDT(c.data_hora)}</strong></Typography>
        <Typography variant="body2" color="text.secondary">Funcionário: <strong>{c.funcionario?.nome || "-"}</strong></Typography>
        <Typography variant="body2" color="text.secondary">Cliente: <strong>{c.cliente?.nome || "Sem cliente"}</strong></Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <ActionButtons item={c} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout title="Comandas" actions={actions}>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["ID", "Comanda", "Data/Hora", "Funcionário", "Cliente", "Status", "Ações"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{comandas.map(renderDesktop)}</TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {comandas.map(renderMobile)}
      </Box>
    </PageLayout>
  );
}

export default ComandaList;