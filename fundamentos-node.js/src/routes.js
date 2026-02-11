// ===============================
// IMPORTAÇÕES E DEPENDÊNCIAS
// ===============================

// Importa a classe Database
// Responsável por encapsular toda a lógica de persistência
import { Database } from './database.js';

// randomUUID é uma função nativa do Node
// Usada para gerar identificadores únicos
// Evita colisões e remove dependência de libs externas
import { randomUUID } from 'node:crypto';

// buildRoutePath é um utilitário customizado
// Ele converte paths com parâmetros (:id)
// em expressões regulares compatíveis com o router
import { buildRoutePath } from './utils/build_route_path.js';

// ===============================
// INSTÂNCIA DO BANCO DE DADOS
// ===============================

// Criamos uma única instância do Database
// Ela ficará viva durante todo o ciclo da aplicação
//
// Conceito importante:
// - Estado compartilhado em memória
// - Simula um singleton de banco
const database = new Database();

// ===============================
// DEFINIÇÃO DAS ROTAS
// ===============================

// routes é um array de configurações
// Cada objeto representa uma rota HTTP
//
// Esse design desacopla:
// - Definição de rotas
// - Engine de servidor HTTP
//
// É exatamente o que frameworks fazem por baixo
export const routes = [

    // ===============================
    // GET /users
    // ===============================
    {
        // Método HTTP esperado
        method: 'GET',

        // Caminho da rota
        // buildRoutePath transforma '/users'
        // em uma estrutura compatível com match dinâmico
        path: buildRoutePath('/users'),

        // Handler é executado quando:
        // - método bate
        // - path bate
        handler: (req, res) => {

            // query vem da URL (?search=algo)
            // Ela já foi previamente parseada em outro middleware
            const { search } = req.query;

            // Busca usuários no banco
            // Se houver search:
            // - filtra por name OU email
            // Caso contrário:
            // - retorna todos
            const users = database.select(
                'users',
                search ? {
                    name: search,
                    email: search
                } : null
            );

            // Envia a resposta como JSON
            // Aqui estamos serializando manualmente
            return res.end(JSON.stringify(users));
        }
    },

    // ===============================
    // POST /users
    // ===============================
    {
        method: 'POST',
        path: buildRoutePath('/users'),
        handler: (req, res) => {

            // body foi previamente preenchido
            // por um middleware de parsing (json.js)
            const { name, email } = req.body;

            // Criação do objeto de domínio (User)
            // ID é gerado no backend (fonte da verdade)
            const user = {
                id: randomUUID(),
                name,
                email
            };

            // Persistência do usuário
            database.insert('users', user);

            // Retorna status 201 (Created)
            // Sem body — design simples e direto
            return res.writeHead(201).end();
        }
    },

    // ===============================
    // PUT /users/:id
    // ===============================
    {
        method: 'PUT',

        // :id indica parâmetro dinâmico de rota
        // buildRoutePath cuida do parsing e regex
        path: buildRoutePath('/users/:id'),

        handler: (req, res) => {

            // params vêm da URL
            // Ex: /users/123 → id = 123
            const { id } = req.params;

            // Dados enviados no corpo da requisição
            const { name, email } = req.body;

            // Atualiza o registro no banco
            database.update('users', id, {
                name,
                email,
            });

            // 204 = No Content
            // Indica sucesso sem retorno de payload
            return res.writeHead(204).end();
        },
    },

    // ===============================
    // DELETE /users/:id
    // ===============================
    {
        method: 'DELETE',
        path: buildRoutePath('/users/:id'),
        handler: (req, res) => {

            // ID vindo da rota
            const { id } = req.params;

            // Remove o usuário do banco
            database.delete('users', id);

            // Retorno padrão para delete bem-sucedido
            return res.writeHead(204).end();
        },
    }
];
