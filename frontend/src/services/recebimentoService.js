import api from "./api";
import { API_ENDPOINTS } from "../config/apiConfig";
// Extrair apenas endpoints utilizados no service
const { RECEBIMENTO } = API_ENDPOINTS;

const recebimentoService = {
  // Dashboard com todas as comandas abertas (total e quantidade de itens)
  getDashboard: async () => {
    const response = await api.get(RECEBIMENTO.DASHBOARD);
    return response.data;
  },
  // Detalhe de uma ou mais comandas (produtos com foto, quantidades e total)
  // ids: array de números, ex: [1, 2]
  getDetalhe: async (ids) => {
    const lista = Array.isArray(ids) ? ids : [ids];
    const url = RECEBIMENTO.DETALHE.replace(":ids", lista.join(","));
    const response = await api.get(url);
    return response.data;
  },
  // Processa o recebimento (pagamento) de uma ou mais comandas em uma única operação
  // payload: { comandas_ids, funcionario_id, cliente_id?, desconto_valor?, acrescimo_valor? }
  receber: async (payload) => {
    const response = await api.post(RECEBIMENTO.RECEBER, payload);
    return response.data;
  },
  // Comprovante detalhado de um recebimento já realizado
  getComprovante: async (recebimentoId) => {
    const url = RECEBIMENTO.COMPROVANTE.replace(":id", recebimentoId);
    const response = await api.get(url);
    return response.data;
  },
};

export default recebimentoService;