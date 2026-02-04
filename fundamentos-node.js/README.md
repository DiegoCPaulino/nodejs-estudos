# Fundamentos com Node.js

Este módulo faz parte do repositório **Node.js Estudos** e documenta minha evolução prática nos **fundamentos do Node.js**, com foco em entender o funcionamento da plataforma **por baixo dos panos**, sem abstrações externas.

O objetivo aqui não é apenas “fazer funcionar”, mas **compreender como o Node.js lida com HTTP, streams, buffers, rotas, middlewares e persistência de dados**, utilizando apenas APIs nativas.

---

## 🎯 Objetivo do Módulo

- Entender o funcionamento do Node.js em baixo nível  
- Criar um servidor HTTP **sem frameworks**
- Trabalhar diretamente com **streams, buffers e eventos**
- Implementar uma **API REST básica** do zero
- Construir uma base sólida para arquiteturas back-end mais complexas

---

## 🧠 Conceitos Aplicados

- Node.js Core (HTTP, Streams, FS, Crypto)
- Streams (Readable, Writable, Transform)
- Buffers e processamento incremental de dados
- Middlewares manuais
- Rotas dinâmicas com Regex
- Query Params e Route Params
- Persistência simples em arquivo (`fs/promises`)
- Organização de código e separação de responsabilidades
---

## 📁 Estrutura do Projeto

```bash
fundamentos-nodejs/
├── src/
│   ├── middlewares/
│   │   └── json.js
│   ├── utils/
│   │   ├── build_route_path.js
│   │   └── extract_query_params.js
│   ├── database.js
│   ├── routes.js
│   └── server.js
│
├── streams/
│   ├── buffer.js
│   ├── fundamentals.js
│   ├── fake_upload_to_http_stream.js
│   └── stream_http_server.js
│
├── package.json
└── README.md
```

## ⚙️ API HTTP (Node.js Puro)

A pasta `src/` contém uma API REST construída sem frameworks, utilizando apenas módulos nativos do Node.js.

O foco é compreender como ferramentas como Express funcionam internamente, reproduzindo manualmente conceitos essenciais.

### Funcionalidades implementadas
- CRUD de usuários
- Rotas dinâmicas (`/users/:id`)
- Query parameters (`/users?search=nome`)
- Middleware manual para parsing de JSON
- Persistência simples em arquivo

### Endpoints disponíveis
- `GET /users`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

---

## 🧩 Middlewares

### `json.js`

Middleware responsável por:
- Consumir o corpo da requisição via **stream**
- Converter os dados para JSON
- Popular o objeto `req.body`
- Definir corretamente o header `Content-Type`

Este arquivo demonstra, na prática, como frameworks lidam com parsing de body internamente.

---

## 🛠️ Utils

### `build_route_path.js`
- Criação de rotas dinâmicas utilizando **expressões regulares**
- Conversão de parâmetros como `:id` em grupos nomeados
- Extração direta de `req.params`

### `extract_query_params.js`
- Extração manual de query params
- Conversão da URL em objeto JavaScript
- Normalização dos parâmetros recebidos

---

## 🗄️ Persistência de Dados

### `database.js`

Implementa uma abstração simples de banco de dados utilizando:
- Leitura e escrita em arquivo JSON
- Operações de `select`, `insert`, `update` e `delete`
- Uso de `fs/promises` para operações assíncronas

A abordagem é intencionalmente simples para manter o foco no **fluxo de dados e arquitetura**, não em ORM.

---

## 🌊 Streams

A pasta `streams/` é dedicada exclusivamente ao estudo aprofundado de **Streams no Node.js**.

### Conceitos abordados
- Buffers e representação binária
- Readable Streams customizadas
- Writable Streams
- Transform Streams
- Pipeline de streams
- Streaming de dados via HTTP

Os arquivos dessa pasta possuem **comentários extensivos**, com foco educacional e entendimento conceitual.

---

## ▶️ Executando o Projeto

### Pré-requisitos
- Node.js 18+

### Iniciando o servidor
```bash
npm run dev
```
O servidor será iniciado em:
```bash
http://localhost:3333
```
---

## 📌 Observações

- Projeto com foco educacional e técnico
- Uso intencional de Node.js puro (sem frameworks)
- Código altamente comentado para estudo
- Base sólida para evolução em APIs REST mais robustas

---

## 🚀 Próximos Passos

- Evolução para uma API REST mais completa
- Introdução de padrões de arquitetura
- Integração com banco de dados
- Implementação de validações, testes e autenticação

---

## 👤 Autor

**Diego Paulino**  
Estudante de Análise e Desenvolvimento de Sistemas  

Foco em **back-end**, fundamentos de **Node.js**, lógica de programação e construção de APIs com base em conceitos de **engenharia de software**.