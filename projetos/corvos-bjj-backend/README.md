# Corvos BJJ Backend

API para gestão da academia Corvos BJJ.

## Endpoints principais

- `POST /auth/login` — autenticação
- `POST /auth/refresh` — renovar access/refresh token
- `POST /auth/forgot-password` — solicitar reset (em dev retorna `resetToken` e `resetUrl`; em produção envia email)
- `PUT /auth/reset-password` — aplicar nova senha via token

### Segurança
- Helmet habilitado e rate limiting configurável (`RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`).
- Payloads de auth validados via Zod (erros retornam `INVALID_BODY` com detalhes).

## Requisitos

- Node.js 20+
- Docker + Docker Compose

## Desenvolvimento rápido

```bash
npm install
npm run db:dev    # sobe Postgres via docker-compose
npm run migrate:dev
npm run seed
npm run dev
```

Backend disponível em `http://localhost:3000`.

## Execução no Codespaces

```bash
npm install
npm run db:dev
npm run migrate:dev
npm run seed
HOST=0.0.0.0 PORT=3000 npm run dev:codespace
```

No Codespaces, publique a porta `3000` e acesse pela URL forwarding do GitHub.

Health check: `GET /health`

## Credenciais de desenvolvimento

- `admin@corvosbjj.com` / `admin123456`
- `professor@corvosbjj.com` / `professor123456`

## Testes

Para testes de integração do backend, o banco precisa estar ativo:

```bash
npm run db:dev
npm run migrate:dev
npm run seed
npm test
```

## Docker

Build da imagem backend:

```bash
docker build -t corvos-bjj-backend .
```

Subir stack full-stack (db + backend + frontend):

```bash
npm run fullstack:up
```

Parar stack full-stack:

```bash
npm run fullstack:down
```

Ver logs da stack full-stack:

```bash
npm run fullstack:logs
```

Nessa stack fullstack, backend executa migrações + seed no startup para ficar pronto para login em ambiente limpo.

URLs:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`

No Codespaces, use as URLs forward das portas `3000` e `3001`.
