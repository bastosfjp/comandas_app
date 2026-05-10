import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Card, CardContent, Typography, Box, Divider, Chip,
} from "@mui/material";
import { FiberNew, People } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageLayout from "../common/PageLayout";
import ActionButtons from "../common/ActionButtons";
import showConfirm from "../../utils/confirm";
import showSnackbar from "../../utils/snackbar";

const grupos = { 1: "Administrador", 2: "Gerente", 3: "Atendente", 4: "Cozinha" };
const grupoColor = { 1: "error", 2: "warning", 3: "primary", 4: "success" };

const funcionarios = [
  { id: 1, nome: "João Pedro Bastos Fernandes", matricula: "00001", cpf: "111.111.111-11", telefone: "(49) 99999-0001", grupo: 1 },
  { id: 2, nome: "Tio Lu da Silva Sauro", matricula: "00002", cpf: "222.222.222-22", telefone: "(49) 98888-0002", grupo: 3 },
  { id: 3, nome: "Marcelinho Beira Mar Jr", matricula: "00003", cpf: "333.333.333-33", telefone: "(49) 97777-0003", grupo: 4 },
];

function FuncionarioList() {
  const navigate = useNavigate();

  const handleView = (item) => showSnackbar(`Visualizando: ${item.nome}`, "info");
  const handleEdit = (item) => navigate(`/funcionario/${item.id}`);
  const handleDelete = (item) =>
    showConfirm("Excluir funcionário", `Deseja excluir ${item.nome}?`, () =>
      showSnackbar(`${item.nome} excluído!`, "success")
    );

  const actions = (
    <Button
      variant="contained" color="secondary"
      onClick={() => navigate("/funcionario")}
      startIcon={<FiberNew />}
      sx={{ fontWeight: 600 }}
    >
      Novo
    </Button>
  );

  const renderDesktop = (f) => (
    <TableRow key={f.id} hover>
      <TableCell>{f.id}</TableCell>
      <TableCell sx={{ fontWeight: 500 }}>{f.nome}</TableCell>
      <TableCell>{f.matricula}</TableCell>
      <TableCell>{f.cpf}</TableCell>
      <TableCell>{f.telefone}</TableCell>
      <TableCell>
        <Chip label={grupos[f.grupo]} color={grupoColor[f.grupo]} size="small" />
      </TableCell>
      <TableCell>
        <ActionButtons item={f} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      </TableCell>
    </TableRow>
  );

  const renderMobile = (f) => (
    <Card key={f.id} sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>{f.nome}</Typography>
            <Typography variant="body2" color="text.secondary">Matrícula: {f.matricula}</Typography>
          </Box>
          <Chip label={grupos[f.grupo]} color={grupoColor[f.grupo]} size="small" />
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" color="text.secondary">CPF: <strong>{f.cpf}</strong></Typography>
        <Typography variant="body2" color="text.secondary">Tel: <strong>{f.telefone}</strong></Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <ActionButtons item={f} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout title="Funcionários" actions={actions}>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["ID", "Nome", "Matrícula", "CPF", "Telefone", "Grupo", "Ações"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{funcionarios.map(renderDesktop)}</TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {funcionarios.map(renderMobile)}
      </Box>
    </PageLayout>
  );
}

export default FuncionarioList;