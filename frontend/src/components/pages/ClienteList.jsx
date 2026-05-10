import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Card, CardContent, Typography, Box, Divider,
} from "@mui/material";
import { FiberNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageLayout from "../common/PageLayout";
import ActionButtons from "../common/ActionButtons";
import showConfirm from "../../utils/confirm";
import showSnackbar from "../../utils/snackbar";

const clientes = [
  { id: 1, nome: "João Não o Bastos Fernandes", cpf: "444.444.444-44", telefone: "(49) 99111-2233" },
  { id: 2, nome: "Doc Brown", cpf: "555.555.555-55", telefone: "(49) 98222-3344" },
  { id: 3, nome: "Alexandre o Grande", cpf: "666.666.666-66", telefone: "(49) 97333-4455" },
];

function ClienteList() {
  const navigate = useNavigate();

  const handleView = (item) => showSnackbar(`Visualizando: ${item.nome}`, "info");
  const handleEdit = (item) => navigate(`/cliente/${item.id}`);
  const handleDelete = (item) =>
    showConfirm("Excluir cliente", `Deseja excluir ${item.nome}?`, () =>
      showSnackbar(`${item.nome} excluído!`, "success")
    );

  const actions = (
    <Button
      variant="contained" color="secondary"
      onClick={() => navigate("/cliente")}
      startIcon={<FiberNew />}
      sx={{ fontWeight: 600 }}
    >
      Novo
    </Button>
  );

  const renderDesktop = (c) => (
    <TableRow key={c.id} hover>
      <TableCell>{c.id}</TableCell>
      <TableCell sx={{ fontWeight: 500 }}>{c.nome}</TableCell>
      <TableCell>{c.cpf}</TableCell>
      <TableCell>{c.telefone}</TableCell>
      <TableCell>
        <ActionButtons item={c} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      </TableCell>
    </TableRow>
  );

  const renderMobile = (c) => (
    <Card key={c.id} sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>{c.nome}</Typography>
            <Typography variant="body2" color="text.secondary">ID: {c.id}</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" color="text.secondary">CPF: <strong>{c.cpf}</strong></Typography>
        <Typography variant="body2" color="text.secondary">Tel: <strong>{c.telefone}</strong></Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <ActionButtons item={c} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout title="Clientes" actions={actions}>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["ID", "Nome", "CPF", "Telefone", "Ações"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{clientes.map(renderDesktop)}</TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {clientes.map(renderMobile)}
      </Box>
    </PageLayout>
  );
}

export default ClienteList;