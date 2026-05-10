// Hook para máscaras de campos
export const useMasks = () => {
  const cleanNumbers = (value) => (value ? value.replace(/\D/g, "") : "");

  const applyCpfMask = (value) => {
    const n = cleanNumbers(value).slice(0, 11);
    if (n.length <= 3) return n;
    if (n.length <= 6) return `${n.slice(0,3)}.${n.slice(3)}`;
    if (n.length <= 9) return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6)}`;
    return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6,9)}-${n.slice(9,11)}`;
  };

  const applyPhoneMask = (value) => {
    const n = cleanNumbers(value).slice(0, 11);
    if (n.length <= 2) return n;
    if (n.length <= 7) return `(${n.slice(0,2)}) ${n.slice(2)}`;
    return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7,11)}`;
  };

  const applyCepMask = (value) => {
    const n = cleanNumbers(value).slice(0, 8);
    if (n.length <= 5) return n;
    return `${n.slice(0,5)}-${n.slice(5)}`;
  };

  return {
    applyCpfMask,
    applyPhoneMask,
    applyCepMask,
    cleanCpf: cleanNumbers,
    cleanPhone: cleanNumbers,
    cleanCep: cleanNumbers,
  };
};

export default useMasks;