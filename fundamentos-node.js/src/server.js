// ===============================
// IMPORTAÇÕES CORE E INTERNAS
// ===============================

// Módulo HTTP nativo do Node
// Responsável por:
// - Criar o servidor
// - Lidar com requests e responses
// - Trabalhar diretamente com streams
import http from 'node:http';

// Middleware responsável por:
// - Ler o corpo da requisição (stream)
// - Fazer parsing de JSON
// - Popular req.body
import { json } from './middlewares/json.js';

// Definição das rotas da aplicação
// Contém método, path e handler
import { routes } from './routes.js';

// Utilitário para transformar a query string (?a=1&b=2)
// em um objeto JavaScript
import { extractQueryParams } from './utils/extract_query_params.js';

// ===============================
// CONCEITOS DE PARÂMETROS HTTP
// ===============================
//
// Query Parameters:
//   - Enviados na URL após ?
//   - Ex: /users?userId=1&name=Teste
//
// Route Parameters:
//   - Fazem parte do path
//   - Ex: /users/1
//
// Request Body:
//   - Dados enviados no corpo da requisição
//   - Normalmente em JSON
//   - Lido via stream

// ===============================
// CRIAÇÃO DO SERVIDOR HTTP
// ===============================

const server = http.createServer(async (req, res) => {

    // Extraímos método e URL da requisição
    // Ex: GET, POST, PUT, DELETE
    // Ex: /users, /users/1?search=abc
    const { method, url } = req;

    // ===============================
    // EXECUÇÃO DOS MIDDLEWARES
    // ===============================

    // Middleware de JSON:
    // - Consome o body (Readable Stream)
    // - Popula req.body
    //
    // IMPORTANTE:
    // Esse await garante que o body
    // esteja totalmente processado
    // antes de chegar nas rotas
    await json(req, res);

    // ===============================
    // MATCHING DE ROTAS
    // ===============================

    // Percorre todas as rotas registradas
    // e tenta encontrar uma que:
    // - tenha o mesmo método HTTP
    // - cujo path (RegExp) bata com a URL
    const route = routes.find(route => {
        return route.method === method && route.path.test(url);
    });

    // ===============================
    // ROTA ENCONTRADA
    // ===============================

    if (route) {

        // Executa o match da URL com a RegExp da rota
        // Isso permite extrair parâmetros dinâmicos
        const routeParams = req.url.match(route.path);

        // routeParams.groups contém:
        // - params da rota (:id)
        // - query string (?a=1&b=2)
        //
        // Exemplo:
        // /users/123?search=abc
        // groups = { id: '123', query: 'search=abc' }

        // Separa a query dos parâmetros da rota
        const { query, ...params } = routeParams.groups;

        // Anexa os parâmetros da rota ao req
        // Ex: req.params.id
        req.params = params;

        // Converte query string em objeto
        // Ex: "search=abc" → { search: 'abc' }
        req.query = extractQueryParams(query);

        // ===============================
        // EXECUÇÃO DO HANDLER
        // ===============================

        // Delegamos o controle para o handler da rota
        // A partir daqui, o server não interfere mais
        return route.handler(req, res);
    }

    // ===============================
    // FALLBACK: ROTA NÃO ENCONTRADA
    // ===============================

    // Se nenhuma rota bater:
    // retornamos 404 (Not Found)
    return res.writeHead(404).end();
});

// ===============================
// SERVER BOOTSTRAP
// ===============================

// Inicializa o servidor na porta 3333
// Processo fica ativo aguardando requisições
server.listen(3333);
