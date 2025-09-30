### Objetivo rápido
Este repositório é uma aplicação front-end React + Vite (sem backend) chamada "Camisa de Rua Store". O objetivo deste arquivo é fornecer orientações práticas para agentes de código (Copilot / AI) trabalharem produtivamente: como construir, executar, padrões do projeto e pontos importantes a conhecer.

### Comandos de desenvolvimento e build
- Iniciar dev server: `npm run dev` (executa `vite`, HMR ativo).
- Build de produção: `npm run build` (gera `dist/`).
- Visualizar build: `npm run preview`.
- Lint: `npm run lint` (usa `eslint`).

Considere usar o Node 18+ e instalar dependências com `npm install` antes de rodar qualquer script.

### Arquitetura & fluxo principal
- Ferramentas: Vite + React (plugin `@vitejs/plugin-react`) + TailwindCSS.
- Entrada: `index.html` carrega `src/main.jsx` que monta o React dentro de `#root`.
- Rotas: `react-router-dom` com duas rotas principais:
  - `/` — Landing pública (no componente `App.jsx`, rota raíz).
  - `/home` — Página protegida (`src/pages/Home.jsx`), redireciona para `/` se não houver usuário.
- Autenticação leve: login/registro são implementados em `src/components/ModalAuth.jsx` usando `localStorage`:
  - Usuários persistidos em `localStorage['users']`.
  - Sessão atual é `localStorage['user']`.
  - Existe um usuário de teste: `teste@teste.com` / `123456`.

### Padrões e convenções do projeto
- Estilo: Tailwind com classes utilitárias; cores personalizadas em `tailwind.config.js` (ex.: `verde-rua`, `verde-neon`, `ouro-claro`). Prefira usar essas classes para consistência.
- Recursos estáticos: imagens e ícones estão em `public/images/` (ex.: `capa.png`, `Vector.png`). Referencie-os com caminhos absolutos a partir da raiz `/images/..`.
- Componentização: componentes pequenos em `src/components/` (ex.: `ModalAuth.jsx`). Páginas em `src/pages/`.
- Dados temporários: catálogo de produtos está hardcoded em `src/pages/Home.jsx` (array `produtos`). Ao modificar, mantenha o formato: { id, nome, preco, categoria }.
- Internacionalização/formatos: preços formatados com `Intl.NumberFormat('pt-BR', { currency: 'BRL' })`.

### Exemplos úteis extraídos do código
- Verificar proteção de rota em `App.jsx`: <user> é guardado em estado e rota `/home` usa `<Navigate to='/' replace />` quando ausente.
- Modal de autenticação (`ModalAuth.jsx`) lança erros com mensagens em PT-BR — preserve mensagens amigáveis quando alterar validações.
- Em `Home.jsx` a função `aplicarFiltro` aceita `"todos"`, `"preco"` (ordena) ou uma `categoria` (filtra). Tests ou alterações devem manter esse contrato.

### O que evitar / cuidados
- Não há backend: mudanças que adicionem chamadas HTTP exigirão criar/instanciar endpoints e adaptar a persistência (atualmente `localStorage`).
- Evite remover o usuário de teste; é útil para fluxos locais.
- Ao adicionar imagens, coloque-as em `public/images` e use path raiz `/images/...`.

### Pontos de integração e dependências
- Dependências principais listadas em `package.json` (React 19, react-router-dom v7, lucide-react para ícones).
- Tailwind configurado em `tailwind.config.js` — adicione novos utilitários lá para serem usados globalmente.

### Exemplos de mudanças seguras
- Refatorar ModalAuth em componentes menores (Form, Input) sem alterar API: props `{ isOpen, onClose, onLoginSuccess }`.
- Mover produtos hardcoded para `src/data/produtos.js` mantendo a mesma estrutura do array.

### Onde procurar ao trabalhar no repositório
- Padrões de rota e boot: `src/main.jsx`, `src/App.jsx`.
- Layouts e páginas: `src/pages/*`.
- Componentes reutilizáveis: `src/components/*`.
- Estilos e tokens: `tailwind.config.js` e `src/index.css`.
