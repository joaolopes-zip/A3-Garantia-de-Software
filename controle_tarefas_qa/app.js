import { STATUS, adicionarTarefa, editarTarefa, excluirTarefa, alterarStatus, salvarTarefas, carregarTarefas } from './core.js';

const $ = s => document.querySelector(s);
const form = $('#task-form');
const listaEl = $('#task-list');
const mensagem = $('#message');
const filtro = $('#filter-status');
let tarefas = carregarTarefas(localStorage);
let editandoId = null;

function persistir() { salvarTarefas(localStorage, tarefas); }
function avisar(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.className = erro ? 'message error' : 'message success';
  mensagem.hidden = false;
  setTimeout(() => { mensagem.hidden = true; }, 3500);
}
function renderizar() {
  const termo = $('#search').value.trim().toLocaleLowerCase('pt-BR');
  const statusSelecionado = filtro.value;
  const visiveis = tarefas.filter(t =>
    (!statusSelecionado || t.status === statusSelecionado) &&
    `${t.titulo} ${t.descricao} ${t.responsavel}`.toLocaleLowerCase('pt-BR').includes(termo)
  );
  $('#total-count').textContent = tarefas.length;
  $('#pending-count').textContent = tarefas.filter(t => t.status === 'Pendente').length;
  $('#progress-count').textContent = tarefas.filter(t => t.status === 'Em andamento').length;
  $('#done-count').textContent = tarefas.filter(t => t.status === 'Concluída').length;
  listaEl.replaceChildren();
  if (!visiveis.length) {
    const vazio = document.createElement('p'); vazio.className = 'empty';
    vazio.textContent = tarefas.length ? 'Nenhuma tarefa corresponde ao filtro.' : 'Nenhuma tarefa cadastrada. Adicione sua primeira tarefa!';
    listaEl.append(vazio); return;
  }
  visiveis.forEach(t => {
    const card = document.createElement('article'); card.className = 'task-card';
    const top = document.createElement('div'); top.className = 'task-top';
    const titulo = document.createElement('h3'); titulo.textContent = t.titulo;
    const badge = document.createElement('span'); badge.className = `status status-${STATUS.indexOf(t.status)}`; badge.textContent = t.status;
    top.append(titulo, badge);
    const descricao = document.createElement('p'); descricao.className = 'description'; descricao.textContent = t.descricao || 'Sem descrição';
    const meta = document.createElement('div'); meta.className = 'meta';
    const resp = document.createElement('span'); resp.textContent = `Responsável: ${t.responsavel}`;
    const data = document.createElement('span'); data.textContent = `Vencimento: ${new Date(`${t.vencimento}T00:00:00`).toLocaleDateString('pt-BR')}`;
    meta.append(resp, data);
    const actions = document.createElement('div'); actions.className = 'actions';
    const select = document.createElement('select'); select.setAttribute('aria-label', `Status de ${t.titulo}`);
    STATUS.forEach(s => { const op = document.createElement('option'); op.value = s; op.textContent = s; select.append(op); });
    select.value = t.status;
    select.addEventListener('change', () => { tarefas = alterarStatus(tarefas, t.id, select.value); persistir(); renderizar(); avisar('Status atualizado.'); });
    const edit = document.createElement('button'); edit.className = 'btn btn-light'; edit.textContent = 'Editar'; edit.addEventListener('click', () => preencherEdicao(t));
    const del = document.createElement('button'); del.className = 'btn btn-danger'; del.textContent = 'Excluir'; del.addEventListener('click', () => {
      if (confirm(`Deseja excluir a tarefa "${t.titulo}"?`)) { tarefas = excluirTarefa(tarefas, t.id); persistir(); renderizar(); avisar('Tarefa excluída.'); }
    });
    actions.append(select, edit, del); card.append(top, descricao, meta, actions); listaEl.append(card);
  });
}
function preencherEdicao(t) {
  editandoId = t.id;
  $('#titulo').value = t.titulo; $('#descricao').value = t.descricao;
  $('#responsavel').value = t.responsavel; $('#vencimento').value = t.vencimento; $('#status').value = t.status;
  $('#form-title').textContent = 'Editar tarefa'; $('#submit-label').textContent = 'Salvar alterações'; $('#cancel-edit').hidden = false;
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function limparFormulario() {
  form.reset(); editandoId = null; $('#form-title').textContent = 'Nova tarefa';
  $('#submit-label').textContent = 'Adicionar tarefa'; $('#cancel-edit').hidden = true;
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const dados = { titulo: $('#titulo').value, descricao: $('#descricao').value, responsavel: $('#responsavel').value, vencimento: $('#vencimento').value, status: $('#status').value };
  try {
    const estavaEditando = Boolean(editandoId);
    tarefas = estavaEditando ? editarTarefa(tarefas, editandoId, dados) : adicionarTarefa(tarefas, dados);
    persistir(); limparFormulario(); renderizar(); avisar(estavaEditando ? 'Tarefa atualizada.' : 'Tarefa cadastrada com sucesso.');
  } catch (err) { avisar(err.message, true); }
});
$('#cancel-edit').addEventListener('click', limparFormulario);
$('#search').addEventListener('input', renderizar); filtro.addEventListener('change', renderizar);
renderizar();
