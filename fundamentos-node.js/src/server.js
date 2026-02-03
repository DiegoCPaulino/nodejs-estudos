import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { json } from './middlewares/json.js';
import { Database } from './middlewares/database.js';

const database = new Database();

const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    await json(req, res)

    if (method == 'GET' && url == '/users') {
        const users = database.select('users');
        
        return res.end(JSON.stringify(users)) // JSON.stringify(users) | Transforma o array users em um JSON
    }
    if (method == 'POST' && url == '/users') {
        const { name, email } = req.body;
        
        const user = {
            id: randomUUID(),
            name,
            email
        }
    
        database.insert('users', user);
    
        return res.writeHead(201).end() // writeHead() | Criação de StatusCode
    }

    return res.writeHead(404).end();
})

server.listen(3333);

/*
GET => Buscar um recurso no back-end
POST => Criar um recurso no back-end
PUT => Atualizar um recurso no back-end
PATCH => Atualizar um recurso especifico no back-end
DELETE => Deletar um recurso no back-end
*/


// Stateful => Sempre guarda informações na memória do PC
// Stateless => Guarda as inormações em bancos de dados, etc.

// JSON => JavaScript Object Notation

/*
CABEÇALHOS (req (requisição)/res (resposta)) = Metadados
São informações adicionais sobre como interpretar o dado que está sendo enviado ou recebido, e não sobre o dado em sí.
*/