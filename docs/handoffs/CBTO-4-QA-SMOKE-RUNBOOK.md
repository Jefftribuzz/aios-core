# CBTO-4 QA Smoke Runbook — Corvos BJJ

## Objetivo
Validar rapidamente se staging e produção estão operacionais após deploy, com critérios de Go/No-Go claros.

## Escopo
- Ambientes: `staging` e `production`
- Superfícies: frontend, backend, autenticação, fluxos críticos de negócio

## Pré-requisitos
- URLs dos ambientes:
  - `STAGING_FRONTEND_URL`
  - `STAGING_BACKEND_URL`
  - `PROD_FRONTEND_URL`
  - `PROD_BACKEND_URL`
- Credencial válida de teste (perfil professor)
- Banco com dados mínimos para CRUD

## Execução (ordem obrigatória)

### 1) Health checks (backend)
- [ ] `GET {BACKEND_URL}/health` retorna `200`
- [ ] Tempo de resposta < 2s
- [ ] Sem erro 5xx no body

### 2) Disponibilidade frontend
- [ ] `{FRONTEND_URL}/login` abre sem erro
- [ ] Assets principais carregam (JS/CSS)
- [ ] Sem erro fatal no console do browser

### 3) Autenticação
- [ ] Login com usuário válido retorna sessão ativa
- [ ] Redireciona para `/dashboard`
- [ ] Logout encerra sessão e bloqueia rota protegida
- [ ] Refresh de sessão funciona (sem relogar manualmente)

### 4) Fluxo protegido principal
- [ ] Navegar `/dashboard` -> `/students` -> `/payments` -> `/grades`
- [ ] Sem redirecionamento indevido para login
- [ ] Sem erro 5xx em requests da navegação

### 5) CRUD crítico — Students
- [ ] Criar aluno
- [ ] Editar aluno
- [ ] Excluir aluno
- [ ] Confirmar refletido na listagem

### 6) CRUD crítico — Payments
- [ ] Criar pagamento
- [ ] Editar pagamento (status/metadados)
- [ ] Excluir pagamento
- [ ] Confirmar refletido na listagem

### 7) CRUD crítico — Grades
- [ ] Criar graduação
- [ ] Editar graduação
- [ ] Excluir graduação
- [ ] Confirmar refletido na listagem

### 8) Regressão rápida de API
- [ ] Endpoints retornam códigos esperados (2xx/4xx)
- [ ] Erros de validação retornam payload consistente
- [ ] Sem falha de CORS entre frontend/backend

## Critério de Go/No-Go

### GO
- Todos os itens de 1 a 8 em verde
- Sem erro bloqueante (login/quebra de CRUD/5xx recorrente)

### NO-GO
- Qualquer falha em autenticação, rota protegida, CRUD crítico ou health check

## Evidência mínima a anexar
- Ambiente testado (`staging` ou `production`)
- Data/hora da execução
- Resultado por bloco (1..8)
- 3 screenshots:
  - Login OK
  - Navegação protegida OK
  - Um CRUD concluído
- Lista curta de incidentes (se houver)

## Template de resultado (copiar/colar)

```md
Ambiente: <staging|production>
Data: <YYYY-MM-DD HH:mm>
Executor: @qa

[1] Health backend: PASS|FAIL
[2] Frontend disponível: PASS|FAIL
[3] Autenticação: PASS|FAIL
[4] Fluxo protegido: PASS|FAIL
[5] CRUD Students: PASS|FAIL
[6] CRUD Payments: PASS|FAIL
[7] CRUD Grades: PASS|FAIL
[8] Regressão API: PASS|FAIL

Resultado final: GO|NO-GO
Observações: <curtas>
```

## Comandos úteis

```bash
curl -i {BACKEND_URL}/health
```

```bash
# opcional: smoke sintético simples do backend
curl -sS {BACKEND_URL}/health | cat
```
