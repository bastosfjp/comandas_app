import { useState, useEffect, useMemo } from "react";
import {
  Box, Typography, Card, CardContent, Divider, Chip, Button, TextField,
  IconButton, Avatar, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, Table, TableBody, TableCell, TableRow, InputAdornment,
} from "@mui/material";
import {
  PointOfSale, Receipt, CheckCircle, Add, Close, Search,
  ShoppingCartCheckout, Print, FactCheck, RestaurantMenu,
} from "@mui/icons-material";
import PageLayout from "../common/PageLayout";
import recebimentoService from "../../services/recebimentoService";
import showSnackbar from "../../utils/snackbar";
import { useAuth } from "../../context/AuthContext";

const fmt = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v) || 0);

const fmtData = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

function Caixa() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState([]);
  const [loadingDash, setLoadingDash] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [detalhe, setDetalhe] = useState(null);
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);
  const [numeroInput, setNumeroInput] = useState("");
  const [desconto, setDesconto] = useState("");
  const [acrescimo, setAcrescimo] = useState("");
  const [processing, setProcessing] = useState(false);
  const [comprovante, setComprovante] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // incrementar para recarregar o dashboard

  // ---- Carregar dashboard de comandas abertas ----
  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      try {
        setLoadingDash(true);
        const data = await recebimentoService.getDashboard();
        if (ativo) setDashboard(data || []);
      } catch (error) {
        if (ativo) showSnackbar(error.apiMessage || "Erro ao carregar comandas abertas", "error");
      } finally {
        if (ativo) setLoadingDash(false);
      }
    };
    carregar();
    return () => { ativo = false; };
  }, [refreshKey]);

  // ---- Buscar detalhe sempre que a seleção mudar ----
  useEffect(() => {
    let cancelado = false;
    const carregarDetalhe = async () => {
      if (selectedIds.length === 0) {
        setDetalhe(null);
        return;
      }
      try {
        setLoadingDetalhe(true);
        const data = await recebimentoService.getDetalhe(selectedIds);
        if (!cancelado) setDetalhe(data);
      } catch (error) {
        if (!cancelado) showSnackbar(error.apiMessage || "Erro ao detalhar comandas", "error");
      } finally {
        if (!cancelado) setLoadingDetalhe(false);
      }
    };
    carregarDetalhe();
    return () => { cancelado = true; };
  }, [selectedIds]);

  // ---- Seleção ----
  const toggleSelecao = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const adicionarPorNumero = () => {
    const termo = numeroInput.trim();
    if (!termo) return;
    const comanda = dashboard.find((c) => String(c.comanda).toLowerCase() === termo.toLowerCase());
    if (!comanda) {
      showSnackbar(`Comanda "${termo}" não encontrada entre as abertas`, "warning");
      return;
    }
    if (!selectedIds.includes(comanda.id)) {
      setSelectedIds((prev) => [...prev, comanda.id]);
    }
    setNumeroInput("");
  };

  const limparSelecao = () => {
    setSelectedIds([]);
    setDesconto("");
    setAcrescimo("");
  };

  // ---- Valores ----
  const subtotal = detalhe?.total_geral || 0;
  const descontoNum = Math.max(0, parseFloat(desconto.replace(",", ".")) || 0);
  const acrescimoNum = Math.max(0, parseFloat(acrescimo.replace(",", ".")) || 0);
  const valorFinal = useMemo(
    () => Math.max(0, subtotal - descontoNum + acrescimoNum),
    [subtotal, descontoNum, acrescimoNum],
  );

  // ---- Receber ----
  const handleReceber = async () => {
    if (selectedIds.length === 0) {
      showSnackbar("Selecione ao menos uma comanda", "warning");
      return;
    }
    if (descontoNum > subtotal + acrescimoNum) {
      showSnackbar("O desconto não pode ser maior que o valor total", "warning");
      return;
    }
    try {
      setProcessing(true);
      const payload = {
        comandas_ids: selectedIds,
        funcionario_id: user?.id,
        desconto_valor: descontoNum || null,
        acrescimo_valor: acrescimoNum || null,
      };
      const resultado = await recebimentoService.receber(payload);
      showSnackbar(resultado.mensagem || "Recebimento realizado com sucesso", "success");
      // Buscar comprovante para exibição
      const comp = await recebimentoService.getComprovante(resultado.recebimento_id);
      setComprovante(comp);
      // Atualizar tela
      limparSelecao();
      setRefreshKey((k) => k + 1);
    } catch (error) {
      showSnackbar(error.apiMessage || "Erro ao processar recebimento", "error");
    } finally {
      setProcessing(false);
    }
  };

  const totalAberto = dashboard.reduce((s, c) => s + (Number(c.total) || 0), 0);

  return (
    <PageLayout title="Caixa — Recebimento" maxWidth="xl">
      {/* ===== Resumo ===== */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, gap: 3, mb: 4 }}>
        {[
          { icon: <Receipt />, label: "Comandas abertas", value: String(dashboard.length), color: "#3b82f6" },
          { icon: <PointOfSale />, label: "Total em aberto", value: fmt(totalAberto), color: "#10b981" },
          { icon: <FactCheck />, label: "Selecionadas", value: String(selectedIds.length), color: "#f59e0b" },
        ].map((card) => (
          <Card
            key={card.label}
            elevation={2}
            sx={{ borderTop: `3px solid ${card.color}`, transition: "transform .15s", "&:hover": { transform: "translateY(-2px)" } }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ color: card.color, mb: 1 }}>{card.icon}</Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: card.color }}>{card.value}</Typography>
              <Typography variant="body2" fontWeight={600}>{card.label}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4, alignItems: "start" }}>
        {/* ===== Coluna esquerda: dashboard de comandas abertas ===== */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Comandas abertas</Typography>

          {/* Buscar/selecionar por número */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              size="small" fullWidth placeholder="Digite o número da comanda"
              value={numeroInput}
              onChange={(e) => setNumeroInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && adicionarPorNumero()}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
            />
            <Button variant="contained" startIcon={<Add />} onClick={adicionarPorNumero} sx={{ whiteSpace: "nowrap" }}>
              Adicionar
            </Button>
          </Box>

          {loadingDash ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress color="secondary" /></Box>
          ) : dashboard.length === 0 ? (
            <Card elevation={1}><CardContent sx={{ textAlign: "center", py: 5 }}>
              <CheckCircle sx={{ fontSize: 48, color: "success.main", mb: 1 }} />
              <Typography color="text.secondary">Nenhuma comanda aberta no momento.</Typography>
            </CardContent></Card>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {dashboard.map((c) => {
                const ativo = selectedIds.includes(c.id);
                return (
                  <Card
                    key={c.id} elevation={1} onClick={() => toggleSelecao(c.id)}
                    sx={{
                      cursor: "pointer", transition: "all .15s",
                      outline: "2px solid",
                      outlineColor: ativo ? "secondary.main" : "transparent",
                      bgcolor: ativo ? "rgba(245,158,11,0.06)" : "background.paper",
                      "&:hover": { bgcolor: ativo ? "rgba(245,158,11,0.06)" : "grey.50" },
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
                          <Avatar sx={{ bgcolor: ativo ? "success.main" : "primary.main", width: 40, height: 40 }}>
                            {ativo ? <CheckCircle fontSize="small" /> : <Receipt fontSize="small" />}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography fontWeight={700} noWrap>Comanda {c.comanda}</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.3, flexWrap: "wrap" }}>
                              <Chip label="Aberta" color="success" size="small" />
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {c.cliente?.nome || "Sem cliente"} · {c.quantidade_produtos} {c.quantidade_produtos === 1 ? "item" : "itens"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                          <Typography fontWeight={700} color="success.main">{fmt(c.total)}</Typography>
                          <Typography variant="caption" color="text.secondary">{fmtData(c.data_hora)}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>

        {/* ===== Coluna direita: conferência e recebimento ===== */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Conferência</Typography>
          <Card elevation={2}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              {selectedIds.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                  <ShoppingCartCheckout sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
                  <Typography>Selecione comandas ao lado para conferir e receber.</Typography>
                </Box>
              ) : loadingDetalhe || !detalhe ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress color="secondary" /></Box>
              ) : (
                <>
                  {/* Cabeçalho da conferência */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Chip label={`${detalhe.quantidade_comandas} comanda(s)`} color="primary" size="small" />
                    <Button size="small" color="inherit" startIcon={<Close />} onClick={limparSelecao}>Limpar</Button>
                  </Box>

                  {/* Comandas e itens */}
                  {detalhe.comandas.map((cmd) => (
                    <Box key={cmd.id} sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography sx={{ fontWeight: 700 }}>
                          Comanda {cmd.comanda}
                          {cmd.cliente?.nome && (
                            <Typography component="span" variant="body2" color="text.secondary"> · {cmd.cliente.nome}</Typography>
                          )}
                        </Typography>
                        <Typography sx={{ fontWeight: 700, color: "success.main" }}>{fmt(cmd.total)}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {cmd.itens.map((it, idx) => (
                          <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar variant="rounded" src={it.foto || undefined} sx={{ width: 44, height: 44, bgcolor: "#f1f5f9" }}>
                              {!it.foto && <RestaurantMenu sx={{ color: "#94a3b8" }} />}
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{it.nome}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {it.quantidade} × {fmt(it.valor_unitario)}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{fmt(it.subtotal)}</Typography>
                          </Box>
                        ))}
                      </Box>
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  ))}

                  {/* Desconto / acréscimo */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <TextField
                      label="Desconto (R$)" size="small" value={desconto}
                      onChange={(e) => setDesconto(e.target.value)} inputMode="decimal"
                      InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
                    />
                    <TextField
                      label="Acréscimo (R$)" size="small" value={acrescimo}
                      onChange={(e) => setAcrescimo(e.target.value)} inputMode="decimal"
                      InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
                    />
                  </Box>

                  {/* Resumo de valores */}
                  <Box sx={{ bgcolor: "#f8fafc", borderRadius: 2, p: 2, mb: 2 }}>
                    <Linha label="Subtotal" value={fmt(subtotal)} />
                    {descontoNum > 0 && <Linha label="Desconto" value={`- ${fmt(descontoNum)}`} color="error.main" />}
                    {acrescimoNum > 0 && <Linha label="Acréscimo" value={`+ ${fmt(acrescimoNum)}`} color="warning.main" />}
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 800 }}>TOTAL A PAGAR</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: "success.main" }}>{fmt(valorFinal)}</Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth size="large" variant="contained" color="success"
                    startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <PointOfSale />}
                    disabled={processing} onClick={handleReceber}
                    sx={{ fontWeight: 700, py: 1.3 }}
                  >
                    {processing ? "Processando..." : "Receber e finalizar"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* ===== Comprovante ===== */}
      <ComprovanteDialog comprovante={comprovante} onClose={() => setComprovante(null)} />
    </PageLayout>
  );
}

// Linha auxiliar do resumo de valores
function Linha({ label, value, color = "text.primary" }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.3 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color }}>{value}</Typography>
    </Box>
  );
}

// ===== Dialog do comprovante de recebimento =====
function ComprovanteDialog({ comprovante, onClose }) {
  if (!comprovante) return null;
  const { cabecalho, funcionario, cliente, comandas = [], resumo_valores = {}, recebimento = {}, rodape = {} } = comprovante;

  return (
    <Dialog open={!!comprovante} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle color="success" />
          <Typography component="span" sx={{ fontWeight: 800 }}>Comprovante de Recebimento</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box id="comprovante-print" sx={{ fontFamily: "monospace" }}>
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: 800 }}>{cabecalho?.estabelecimento || "Comandas do Zé"}</Typography>
            <Typography variant="body2">{cabecalho?.titulo}</Typography>
            <Typography variant="caption" color="text.secondary">
              Recebimento #{recebimento?.id} · {fmtData(recebimento?.data_hora || comprovante.data_emissao)}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />

          <Typography variant="body2"><strong>Atendente:</strong> {funcionario?.nome || "-"}</Typography>
          {cliente?.nome && <Typography variant="body2"><strong>Cliente:</strong> {cliente.nome}</Typography>}
          <Divider sx={{ my: 1 }} />

          {comandas.map((cmd) => (
            <Box key={cmd.id} sx={{ mb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Comanda {cmd.comanda} — {fmt(cmd.subtotal)}
              </Typography>
              <Table size="small">
                <TableBody>
                  {(cmd.itens || []).map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ border: 0, py: 0.2, px: 0, fontFamily: "monospace" }}>
                        {it.quantidade}x {it.nome}
                      </TableCell>
                      <TableCell align="right" sx={{ border: 0, py: 0.2, px: 0, fontFamily: "monospace" }}>
                        {fmt(it.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ))}

          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal</span><span>{fmt(resumo_valores.subtotal)}</span>
          </Box>
          {resumo_valores.desconto > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <span>Desconto</span><span>- {fmt(resumo_valores.desconto)}</span>
            </Box>
          )}
          {resumo_valores.acrescimo > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <span>Acréscimo</span><span>+ {fmt(resumo_valores.acrescimo)}</span>
            </Box>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
            <Typography sx={{ fontWeight: 800 }}>TOTAL PAGO</Typography>
            <Typography sx={{ fontWeight: 800 }}>{fmt(resumo_valores.valor_final)}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "text.secondary" }}>
            {rodape?.mensagem || "Obrigado pela preferência!"}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<Print />} onClick={() => window.print()}>Imprimir</Button>
        <Button variant="contained" onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Caixa;