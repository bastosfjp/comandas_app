import { useEffect, useState } from "react";
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
import { clienteService } from "../../services/clienteService";

function ClienteList() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.list();
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      showSnackbar('Erro ao carregar clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const getItemId = (item) => item?.id ?? item?._id;
  const handleView = (item) => navigate(`/cliente/view/${getItemId(item)}`);
  const handleEdit = (item) => navigate(`/cliente/edit/${getItemId(item)}`);
  const handleDelete = (item) =>
    showConfirm("Excluir cliente", `Deseja excluir ${item.nome}?`, async () => {
      try {
        const id = getItemId(item);
        await clienteService.delete(id);
        setClientes((prev) => prev.filter((c) => getItemId(c) !== id));
        showSnackbar(`${item.nome} excluído com sucesso!`, "success");
      } catch (error) {
        showSnackbar('Erro ao excluir cliente', 'error');
      }
    });

  const actions = (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => navigate("/cliente")}
      startIcon={<FiberNew />}
      sx={{ fontWeight: 600 }}
    >
      Novo
    </Button>
  );

  const renderDesktop = (c) => (
    <TableRow key={getItemId(c)} hover>
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
    <Card key={getItemId(c)} sx={{ mb: 2 }}>
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
      {loading ? (
        <Typography align="center" sx={{ py: 4 }}>Carregando clientes...</Typography>
      ) : (
        <>
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
        </>
      )}
    </PageLayout>
  );
}

export default ClienteList;
