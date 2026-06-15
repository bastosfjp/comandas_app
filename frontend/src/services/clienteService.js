import { API_ENDPOINTS } from '../config/apiConfig';
import api from './api';

const { CLIENTE } = API_ENDPOINTS;

export const clienteService = {
  list: async (params = {}) => {
    const { skip = 0, limit = 100 } = params;
    const queryParams = new URLSearchParams();
    queryParams.append('skip', skip);
    queryParams.append('limit', limit);
    const response = await api.get(`${CLIENTE.LIST}?${queryParams.toString()}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(CLIENTE.GET.replace(':id', id));
    return response.data;
  },
  create: async (data) => {
    const response = await api.post(CLIENTE.CREATE, data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(CLIENTE.UPDATE.replace(':id', id), data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(CLIENTE.DELETE.replace(':id', id));
    return { success: true };
  },
};

export default clienteService;
