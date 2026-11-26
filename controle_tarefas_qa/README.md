# TaskFlow — Sistema de Controle de Tarefas

Projeto acadêmico da disciplina Garantia da Qualidade de Software — IBMR.

## Como executar
1. Extraia a pasta do ZIP.
2. Abra um terminal dentro da pasta `controle_tarefas_qa`.
3. Inicie um servidor local: `python -m http.server 8000`.
4. Acesse `http://localhost:8000` no navegador.

Também é possível abrir `index.html` diretamente em navegadores modernos, mas o uso de servidor local é recomendado por causa dos módulos JavaScript.

## Funcionalidades
- Criar, listar, editar e excluir tarefas.
- Campos: título, descrição, responsável, vencimento e status.
- Status: Pendente, Em andamento e Concluída.
- Pesquisa por texto e filtro por status.
- Persistência com LocalStorage.
- Validação dos campos obrigatórios e do status.

## Teste automatizado
Requer Node.js 18 ou superior. Na pasta do projeto, execute `npm test` (ou `node --test tests/*.test.js`). Os testes automatizados verificam regras de negócio, validações, operações CRUD e persistência.

## Arquivos
- `index.html`, `style.css`, `app.js`: interface e interação.
- `core.js`: regras de negócio.
- `tests/core.test.js`: testes automatizados.
- `RELATORIO.md`: plano, casos, defeitos, métricas e conclusão.
