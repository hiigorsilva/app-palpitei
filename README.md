# Palpitei Web

Frontend do Palpitei, uma aplicação de bolão online para palpites dos jogos da Copa do Mundo.

## Sobre a Aplicação

O Palpitei é uma aplicação web para organizar um bolão simples da Copa do Mundo. Nela, os participantes entram pelo nome, escolhem seus palpites para cada jogo, acompanham seus acertos, pontuação e posição no ranking.

A aplicação também permite visualizar os participantes do bolão, consultar apostas realizadas por outros usuários, acompanhar jogos futuros e encerrados, usar cartas de dobro de pontos e ver o progresso de participação ao longo da competição.

## Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- TanStack Router
- TanStack Query
- Axios
- React Hook Form + Zod
- Biome

## Requisitos

- Node.js compatível com o projeto
- pnpm `11.5.0`

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz com:

```env
VITE_API_URL=http://localhost:3333/api
```

Em produção, use a URL da API publicada.

## Instalação

```bash
pnpm install
```

## Desenvolvimento

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Preview

```bash
pnpm preview
```

## Estrutura Principal

- `src/view`: rotas e páginas da aplicação
- `src/components`: componentes reutilizáveis
- `src/services`: chamadas HTTP, queries e tipos por domínio
- `src/contexts`: contextos globais
- `src/helpers`: utilitários de apoio
- `src/lib`: configurações compartilhadas

## Observações

- A autenticação de usuário é salva em `sessionStorage`.
- As requisições usam `VITE_API_URL` como base da API.
- A autenticação admin usa Basic Auth a partir das credenciais salvas na sessão.
