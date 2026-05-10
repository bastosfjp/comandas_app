import { Box, Typography, Card, CardContent, Divider, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { PointOfSale, TrendingUp, Receipt, CheckCircle } from "@mui/icons-material";
import PageLayout from "../common/PageLayout";

const movimentos = [
  { id: 1, comanda: "001", cliente: "Ana Paula Costa", valor: 87.50, forma: "Cartão", hora: "10:45" },
  { id: 2, comanda: "002", cliente: "Sem cliente", valor: 34.00, forma: "Dinheiro", hora: "11:20" },
  { id: 3, comanda: "003", cliente: "Bruno Lima", valor: 123.90, forma: "Pix", hora: "12:05" },
];

const total = movimentos.reduce((s, m) => s + m.valor, 0);
const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

function Caixa() {
  return (
    <PageLayout title="Caixa" maxWidth="xl">
      {/* Resumo */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2, mb: 3 }}>
        {[
          { icon: <PointOfSale />, label: "Total do dia", value: fmt(total), color: "#10b981" },
          { icon: <Receipt />, label: "Comandas fechadas", value: "3", color: "#3b82f6" },
          { icon: <TrendingUp />, label: "Ticket médio", value: fmt(total / movimentos.length), color: "#f59e0b" },
          { icon: <CheckCircle />, label: "Comandas abertas", value: "2", color: "#8b5cf6" },
        ].map((card) => (
          <Card key={card.label} elevation={2} sx={{ borderLeft: `4px solid ${card.color}` }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, color: card.color }}>
                {card.icon}
                <Typography variant="body2" color="text.secondary">{card.label}</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: card.color }}>{card.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Movimentos */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Movimentos do dia</Typography>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["Comanda", "Cliente", "Forma de Pagamento", "Hora", "Valor"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {movimentos.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>#{m.comanda}</TableCell>
                  <TableCell>{m.cliente}</TableCell>
                  <TableCell><Chip label={m.forma} size="small" variant="outlined" /></TableCell>
                  <TableCell>{m.hora}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "success.main" }}>{fmt(m.valor)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} sx={{ fontWeight: 700, textAlign: "right" }}>TOTAL</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "success.main", fontSize: "1.1rem" }}>{fmt(total)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {movimentos.map((m) => (
          <Card key={m.id} sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontWeight={700}>#{m.comanda} — {m.hora}</Typography>
                <Typography fontWeight={700} color="success.main">{fmt(m.valor)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">Cliente: <strong>{m.cliente}</strong></Typography>
              <Chip label={m.forma} size="small" variant="outlined" sx={{ mt: 0.5 }} />
            </CardContent>
          </Card>
        ))}
        <Card sx={{ bgcolor: "success.main" }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontWeight={700} color="white">TOTAL DO DIA</Typography>
              <Typography fontWeight={700} color="white" fontSize="1.2rem">{fmt(total)}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageLayout>
  );
}

export default Caixa;