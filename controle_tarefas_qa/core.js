// Regras de negócio do Sistema de Controle de Tarefas
export const STATUS = Object.freeze(['Pendente', 'Em andamento', 'Concluída']);

export function validarTarefa(dados) {
  const erros = [];
  if (!dados || !String(dados.titulo ?? '').trim()) erros.push('O título é obrigatório.');
  if (!dados || !String(dados.responsavel ?? '').trim()) erros.push('O responsável é obrigatório.');
  if (!dados || !String(dados.vencimento ?? '').trim()) erros.push('A data de vencimento é obrigatória.');
  if (dados?.status && !STATUS.includes(dados.status)) erros.push('Status inválido.');
  return erros;
}

export function criarTarefa(dados, id = globalThis.crypto?.randomUUID?.() ?? String(Date.now())) {
  const erros = validarTarefa(dados);
  if (erros.length) throw new Error(erros.join(' '));
  return {
    id,
    titulo: String(dados.titulo).trim(),
    descricao: String(dados.descricao ?? '').trim(),
    responsavel: String(dados.responsavel).trim(),
    vencimento: String(dados.vencimento),
    status: dados.status || 'Pendente'
  };
}

export function adicionarTarefa(lista, dados, id) {
  return [...lista, criarTarefa(dados, id)];
}

export function editarTarefa(lista, id, dados) {
  const indice = lista.findIndex(t => t.id === id);
  if (indice < 0) throw new Error('Tarefa não encontrada.');
  const atualizada = criarTarefa(dados, id);
  return lista.map(t => t.id === id ? atualizada : t);
}

export function excluirTarefa(lista, id) {
  return lista.filter(t => t.id !== id);
}

export function alterarStatus(lista, id, status) {
  if (!STATUS.includes(status)) throw new Error('Status inválido.');
  if (!lista.some(t => t.id === id)) throw new Error('Tarefa não encontrada.');
  return lista.map(t => t.id === id ? { ...t, status } : t);
}

export function salvarTarefas(storage, lista) {
  storage.setItem('tarefas-qa-ibmr', JSON.stringify(lista));
}

export function carregarTarefas(storage) {
  try {
    const dados = JSON.parse(storage.getItem('tarefas-qa-ibmr') || '[]');
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}
