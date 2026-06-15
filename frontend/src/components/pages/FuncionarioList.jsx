import { useEffect, useState } from "react";
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
import { funcionarioService } from "../../services/funcionarioService";

const grupos = { 1: "Administrador", 2: "Gerente", 3: "Atendente", 4: "Cozinha" };
const grupoColor = { 1: "error", 2: "warning", 3: "primary", 4: "success" };

function FuncionarioList() {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFuncionarios = async () => {
    try {
      setLoading(true);
      const data = await funcionarioService.list();
      setFuncionarios(Array.isArray(data) ? data : []);
    } catch (error) {
      showSnackbar('Erro ao carregar funcionários', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFuncionarios();
  }, []);

  const getItemId = (item) => item?.id ?? item?._id;
  const handleView = (item) => navigate(`/funcionario/view/${getItemId(item)}`);
  const handleEdit = (item) => navigate(`/funcionario/edit/${getItemId(item)}`);
  const handleDelete = (item) =>
    showConfirm("Excluir funcionário", `Deseja excluir ${item.nome}?`, async () => {
      try {
        const id = getItemId(item);
        await funcionarioService.delete(id);
        setFuncionarios((prev) => prev.filter((f) => getItemId(f) !== id));
        showSnackbar(`${item.nome} excluído com sucesso!`, "success");
      } catch (error) {
        showSnackbar('Erro ao excluir funcionário', 'error');
      }
    });

  const actions = (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => navigate("/funcionario")}
      startIcon={<FiberNew />}
      sx={{ fontWeight: 600 }}
    >
      Novo
    </Button>
  );

  const renderDesktop = (f) => (
    <TableRow key={getItemId(f)} hover>
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
    <Card key={getItemId(f)} sx={{ mb: 2 }}>
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
      {loading ? (
        <Typography align="center" sx={{ py: 4 }}>Carregando funcionários...</Typography>
      ) : (
        <>
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
        </>
      )}
    </PageLayout>
  );
}

export default FuncionarioList;
