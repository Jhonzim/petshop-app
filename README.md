# PetBuddy Catalog

PetBuddy Catalog é um catálogo de produtos para pet shop com frontend em React + Vite e backend em Node.js + Express. O projeto foi organizado para facilitar a evolução com testes unitários, de integração e E2E no futuro.

## Visão geral do repositório

```
petbuddy-catalog/
├── backend/            # API REST com Express e Prisma (SQLite)
├── frontend/           # Aplicação React + Vite
├── docker-compose.yml  # Ambiente opcional para executar front e back juntos
├── README.md
└── .gitignore
```

## Requisitos

- Node.js 18+
- npm 9+

## Configuração do backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

### Scripts disponíveis

- `npm run dev`: inicia o servidor em modo desenvolvimento com Nodemon.
- `npm run build`: transpila o código TypeScript para JavaScript.
- `npm start`: executa a versão compilada.
- `npm run db:migrate`: aplica as migrações do Prisma no banco SQLite.
- `npm run db:seed`: popula o banco com 20 produtos reais de pet shop.
- `npm run lint`: executa o ESLint.
- `npm run format`: formata os arquivos com Prettier.
- `npm test`: executa os testes (Vitest + Supertest).

### Variáveis de ambiente

| Chave        | Descrição                                    | Padrão             |
| ------------ | -------------------------------------------- | ------------------ |
| `DATABASE_URL` | Caminho do arquivo SQLite utilizado pelo Prisma | `file:./dev.db` |
| `PORT`       | Porta onde o servidor HTTP será iniciado     | `3000`            |
| `JWT_SECRET` | Segredo utilizado para assinar tokens JWT    | — (definir manualmente) |
| `JWT_EXPIRES_IN` | Tempo de expiração dos tokens (ex: `1d`, `12h`) | `1d` |

## Configuração do frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

A aplicação Vite ficará disponível em `http://localhost:5173`.

### Scripts disponíveis

- `npm run dev`: executa o servidor de desenvolvimento Vite.
- `npm run build`: gera a build de produção.
- `npm run preview`: executa a build de produção localmente.
- `npm run lint`: executa o ESLint.
- `npm run format`: formata os arquivos com Prettier.

### Variáveis de ambiente

| Chave           | Descrição                                    | Padrão                    |
| --------------- | -------------------------------------------- | ------------------------- |
| `VITE_API_URL`  | URL base da API (utilizada pelo Axios)       | `http://localhost:3000`   |

## Rotas da API

| Método | Rota                 | Descrição                                                                 |
| ------ | -------------------- | ------------------------------------------------------------------------- |
| POST   | `/api/auth/login`    | Gera um token JWT para acesso de compradores e administradores.          |
| GET    | `/api/health`        | Verificação de saúde do serviço.                                         |
| GET    | `/api/products`      | Lista produtos com filtros (`q`, `category`, `minPrice`, `maxPrice`, `page`, `pageSize`). |
| GET    | `/api/products/:id`  | Retorna um produto específico.                                           |
| POST   | `/api/products`      | Cria um produto (apenas admins). Campos validados com Zod.               |
| PUT    | `/api/products/:id`  | Atualiza um produto existente (apenas admins).                           |
| DELETE | `/api/products/:id`  | Remove um produto (apenas admins).                                       |
| POST   | `/api/products/:id/decrement` | Subtrai itens do estoque (apenas compradores).                              |

## Dados de seed

O script de seed cria 20 produtos com categorias variadas, preços em reais, estoque e descrições reais de itens comuns em pet shops. Ele também provisiona dois usuários:

- **Admin**: `admin@petbuddy.com` / `admin123`
- **Comprador**: `cliente@petbuddy.com` / `cliente123`

Utilize essas credenciais para acessar os dois fluxos de login no frontend.

## Autenticação e perfis

- `/` exibe o formulário de login do **comprador**. Após autenticação, o catálogo fica disponível em `/catalog` e a página de detalhes permite efetuar compras, subtraindo unidades do estoque.
- `/admin` exibe o login do **administrador**. Depois de entrar, o painel administrativo fica em `/admin/dashboard`, com edição e remoção de produtos nas rotas `/admin/:id`.
- As requisições autenticadas utilizam JWT via header `Authorization: Bearer <token>`.

## Pronto para QA

Este repositório foi estruturado para facilitar a criação de testes automatizados:

- **Backend**: utilize Vitest para unitários (`npm test`). Há exemplos iniciais (`tests/productsService.test.ts` e `tests/healthRoute.test.ts`).
- **Frontend**: recomenda-se adicionar Jest/RTL ou Vitest para testes de componentes e React Testing Library. Para E2E, Cypress ou Playwright são boas opções.

### Sugestão de comandos (reservados para uso futuro)

```bash
# Backend
npm run test

# Frontend
npm run test

# E2E (exemplo futuro)
npx playwright test
```

## Docker (opcional)

Você pode iniciar todo o ambiente com Docker Compose:

```bash
docker-compose up
```

O comando aplica migrações, executa seeds e sobe os servidores em modo desenvolvimento.

## Print do catálogo

O seed inicial preenche o catálogo com 20 itens reais, permitindo validar paginação, filtros e tela de detalhes assim que o frontend é iniciado.

## Convenções de código

- ESLint + Prettier configurados para front e back.
- Camadas separadas (controller → service → repository) no backend.
- Validações com mensagens claras via Zod no backend e validação equivalente no formulário do frontend.

Bom proveito! 🐾
