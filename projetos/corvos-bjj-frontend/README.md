# Corvos BJJ Frontend

Frontend do projeto Corvos BJJ (CBTO-3), construído com Next.js + TypeScript + Tailwind.

## Requisitos

- Node.js 20+
- Backend Corvos em execução (padrão: `http://localhost:3000`)

## Setup local

```bash
npm install
cp .env.local.example .env.local
npm run dev:local
```

Aplicação: `http://localhost:3001`

## Setup no Codespaces

```bash
npm install
cp .env.local.example .env.local
npm run dev:codespace
```

No Codespaces, publique a porta `3001` para acessar o frontend no navegador.

## Quality gates

```bash
npm run lint
npm run test
npm run build
```

## Testes E2E (Playwright)

```bash
npx playwright install chromium
npm run test:e2e
```

> Em ambientes com restrição de `apt`/GPG no container, use ao menos `npm run test:e2e -- --list` para validar o discovery da suíte.

## Execução com Docker

```bash
docker build -t corvos-bjj-frontend .
docker run --rm -p 3001:3000 corvos-bjj-frontend
```

## Variáveis de ambiente

Arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Para Codespaces, use a URL forwarding da API na porta `3000`:

```env
NEXT_PUBLIC_API_URL=https://SEU-CODESPACE-3000.app.github.dev
```

## Fluxo recomendado de desenvolvimento

1. Suba backend + banco (veja README do backend).
2. Local: rode `npm run dev:local`.
3. Codespaces: rode `npm run dev:codespace`.
4. Acesse `http://localhost:3001` (local) ou a URL forward da porta `3001` (Codespaces).

## Escopo do kickoff (D0)

- Páginas base: `/login`, `/dashboard`, `/students`, `/payments`, `/grades`
- Autenticação via `POST /auth/login`
- Proteção de rotas com redirecionamento para `/login`
- HTTP client com interceptor JWT e refresh token (`/auth/refresh`)
- Layout inicial com Header + Sidebar

## Credenciais de desenvolvimento

- `professor@corvosbjj.com` / `professor123456`

