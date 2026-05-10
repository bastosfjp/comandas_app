export const useValidationRules = () => ({
  nome: {
    required: "Nome é obrigatório",
    maxLength: { value: 100, message: "Nome deve ter no máximo 100 caracteres" },
  },
  cpf: {
    required: "CPF é obrigatório",
    maxLength: { value: 14, message: "CPF inválido" },
    minLength: { value: 14, message: "CPF deve ter 11 dígitos" },
  },
  telefone: {
    required: "Telefone é obrigatório",
    maxLength: { value: 15, message: "Telefone inválido" },
    minLength: { value: 14, message: "Telefone deve ter pelo menos 10 dígitos" },
  },
  matricula: {
    required: "Matrícula é obrigatória",
    maxLength: { value: 11, message: "Matrícula deve ter no máximo 11 caracteres" },
  },
  senha: {
    required: "Senha é obrigatória",
    minLength: { value: 6, message: "Senha deve ter pelo menos 6 caracteres" },
  },
  grupo: { required: "Grupo é obrigatório" },
  descricao: {
    required: "Descrição é obrigatória",
    maxLength: { value: 200, message: "Descrição deve ter no máximo 200 caracteres" },
  },
  valor_unitario: {
    required: "Valor unitário é obrigatório",
    min: { value: 0.01, message: "Valor deve ser maior que 0" },
  },
  comanda: {
    required: "Número da comanda é obrigatório",
    maxLength: { value: 50, message: "Comanda deve ter no máximo 50 caracteres" },
  },
  endereco: {
    maxLength: { value: 150, message: "Endereço deve ter no máximo 150 caracteres" },
  },
  cep: {
    maxLength: { value: 9, message: "CEP inválido" },
    minLength: { value: 9, message: "CEP deve ter 8 dígitos" },
  },
  bairro: {
    maxLength: { value: 50, message: "Bairro deve ter no máximo 50 caracteres" },
  },
  cidade: {
    maxLength: { value: 50, message: "Cidade deve ter no máximo 50 caracteres" },
  },
  email: {
    maxLength: { value: 100, message: "E-mail deve ter no máximo 100 caracteres" },
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" },
  },
  observacao: {
    maxLength: { value: 200, message: "Observação deve ter no máximo 200 caracteres" },
  },
});

export default useValidationRules;