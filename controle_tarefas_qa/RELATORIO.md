# Relatório Final — MiniProjeto de Garantia da Qualidade de Software

**Projeto:** TaskFlow — Sistema de Controle de Tarefas  
**Disciplina:** Garantia da Qualidade de Software  
**Instituição:** IBMR  
**Versão:** 1.0  
**Data:** 22/11/2026

## 1. Objetivo
Desenvolver uma aplicação simples para organizar tarefas e aplicar práticas de garantia da qualidade por meio de planejamento, execução de testes, identificação e correção de defeitos, automação e métricas.

## 2. Escopo da aplicação
A aplicação permite cadastrar, listar, editar e excluir tarefas, além de alterar seu status entre Pendente, Em andamento e Concluída. Cada registro possui título, descrição, responsável, data de vencimento e status. Os dados são armazenados no LocalStorage do navegador, sem backend ou banco de dados.

**Fora do escopo:** autenticação, múltiplos usuários, sincronização em nuvem, notificações e API.

## 3. Plano de testes
**Objetivo:** verificar se as funcionalidades atendem aos requisitos, se entradas inválidas são tratadas e se os dados permanecem salvos após recarregar a aplicação.

**Tipos e técnicas:**
- **Caixa preta:** validar entradas e saídas sem considerar a implementação interna (cadastro válido, campos obrigatórios, exclusão e persistência).
- **Caixa branca:** analisar decisões e caminhos das funções de validação, edição, alteração de status e tratamento de JSON inválido.
- **Funcional:** verificar cada operação disponível na interface.
- **Integração:** verificar interação entre operações e LocalStorage.
- **Regressão:** reexecutar a suíte automatizada após alterações/correções.

**Ambiente:** navegador moderno, servidor HTTP local e Node.js 18+ para automação.  
**Dados de teste:** tarefa “Estudar SQL”, descrição “Revisar SELECT”, responsável “Ana”, vencimento 01/12/2026 e status Pendente. Para testes negativos, usar título ou responsável vazio e status inválido.

## 4. Casos de teste
| ID | Cenário | Técnica | Resultado esperado | Resultado da automação |
|---|---|---|---|---|
| CT01 | Cadastrar tarefa válida | Caixa preta/funcional | Tarefa criada com os dados informados | Aprovado |
| CT02 | Cadastrar sem título | Caixa preta/validação | Operação rejeitada com mensagem de validação | Aprovado |
| CT03 | Excluir tarefa | Funcional | Tarefa removida da lista | Aprovado |
| CT04 | Alterar status | Funcional | Status atualizado | Aprovado |
| CT05 | Salvar e carregar novamente | Integração | Dados persistidos recuperados | Aprovado |
| CT06 | Editar tarefa | Funcional | Dados atualizados sem duplicação | Aprovado |
| CT07 | Informar responsável vazio | Caixa preta | Entrada rejeitada | Aprovado |
| CT08 | Informar status inválido | Caixa branca | Operação rejeitada | Aprovado |
| CT09 | Editar ID inexistente | Caixa branca | Erro controlado de tarefa não encontrada | Aprovado |
| CT10 | Carregar armazenamento com JSON corrompido | Caixa branca/robustez | Retornar lista vazia sem interromper a aplicação | Aprovado |

**Observação sobre evidências:** os dez casos acima possuem testes automatizados no arquivo `tests/core.test.js`. A execução pode ser reproduzida com `npm test`. A suíte automatizada valida as regras de negócio; CT01–CT10 não substituem a captura de evidências visuais da interface no navegador.

## 5. Registro e tratamento de defeitos
Os dois defeitos abaixo são cenários reproduzíveis de falha usados para demonstrar o processo de gestão de defeitos. Eles foram tratados na implementação entregue; não devem ser interpretados como falhas atualmente presentes na versão final.

| ID | Descrição / reprodução | Severidade | Correção / estado |
|---|---|---|---|
| BUG01 | Formulário aceitava título vazio, criando tarefa sem identificação. Reproduzir tentando enviar o formulário sem preencher o título. | Média | Campo obrigatório no formulário e validação na camada de regras de negócio. Corrigido. |
| BUG02 | Alteração de status não era persistida e poderia ser perdida após recarregar a página. Reproduzir alterando o status e recarregando. | Média | Persistir a lista atualizada no LocalStorage após a alteração. Corrigido. |

## 6. Teste automatizado
Foi implementada uma suíte automatizada com o módulo nativo `node:test`, sem dependências externas. Ela cobre dez verificações: cadastro válido, título obrigatório, exclusão, alteração de status, persistência, edição, responsável obrigatório, status inválido, edição de ID inexistente e recuperação diante de JSON corrompido.

**Comando:** `npm test` ou `node --test tests/*.test.js`.

**Resultado registrado:** 10 testes automatizados aprovados, 0 reprovados, após execução local da suíte. Os testes automatizados cobrem as regras de negócio; a interface deve também ser demonstrada manualmente no navegador durante a apresentação.

## 7. Métricas de qualidade
| Métrica | Resultado |
|---|---:|
| Casos automatizados executados | 10 |
| Aprovados | 10 |
| Reprovados | 0 |
| Percentual de aprovação | 100% |
| Defeitos documentados | 2 |
| Defeitos corrigidos | 2 |
| Percentual de correção dos defeitos documentados | 100% |

Cálculo: percentual de aprovação = (10 ÷ 10) × 100 = 100%. Percentual de correção = (2 ÷ 2) × 100 = 100%.

## 8. Conclusão
A aplicação atende ao escopo proposto para o controle básico de tarefas e incorpora validação de campos, operações de manutenção, filtros e persistência local. A suíte automatizada cobre os principais comportamentos das regras de negócio e apresentou 100% de aprovação na execução realizada. Os defeitos documentados foram corrigidos. Como limitação, os dados permanecem somente no navegador utilizado e não são compartilhados entre dispositivos. Para a entrega acadêmica, recomenda-se anexar capturas de tela da aplicação em funcionamento e da saída do comando de testes, além de realizar a demonstração manual dos fluxos da interface.

## 9. Roteiro sugerido para apresentação
1. Explicar o objetivo e o escopo do TaskFlow.
2. Cadastrar uma tarefa válida e mostrar a listagem.
3. Tentar cadastrar sem título para demonstrar validação.
4. Editar uma tarefa, mudar o status e excluir outra.
5. Recarregar a página e mostrar que os dados continuam salvos.
6. Executar `npm test` e explicar os dez testes automatizados.
7. Apresentar BUG01 e BUG02, suas correções e as métricas.

## 10. Instruções de execução
Consultar o arquivo `README.md`. A aplicação pode ser executada com `python -m http.server 8000` e aberta em `http://localhost:8000`.
