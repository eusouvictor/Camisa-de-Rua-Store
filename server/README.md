Server (Express) — esqueleto para desenvolvimento
==================

Esta pasta contém um servidor Express mínimo usado apenas para desenvolvimento local e testes rápidos.

Como usar:

1. Entre na pasta do servidor:

   cd server

2. Instale dependências:

   npm install

3. Inicie em modo dev (nodemon):

   npm run dev

Endpoints disponíveis (exemplos):

- GET /health — retorna status do servidor
- POST /api/auth/register — registra um usuário (desenvolvimento, em memória)
- POST /api/auth/login — autentica um usuário (desenvolvimento, sem JWT)
- GET /api/produtos — lista de produtos de exemplo

Notas:

- O servidor atualmente mantém usuários em memória apenas para facilitar o desenvolvimento do front-end. Para produção, substitua por persistência (SQLite/Postgres/MongoDB) e implemente autenticação (JWT ou sessions).
- As configurações de ambiente estão em `.env.example`.

Se quiser, posso implementar persistência simples com um arquivo JSON ou SQLite e adicionar autenticação JWT.
