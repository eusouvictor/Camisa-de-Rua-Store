Server (scaffold)
==================

Este diretório contém um esqueleto mínimo para o backend (Express). Não há endpoints de API implementados — o objetivo é servir como base para discutirmos rotas, persistência e autenticação antes de prosseguir.

Como usar (desenvolvimento):

1. Instalar dependências:

   npm install

2. Iniciar em modo dev (nodemon):

   npm run dev

Endpoints provisórios:

- GET /health — retorna status básico

Próximos passos a discutir: esquema de dados, persistência (SQLite/Postgres), autenticação (JWT/sessions), e rotas públicas/privadas.
