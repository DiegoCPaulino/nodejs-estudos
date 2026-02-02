import http from 'node:http';

const users = []

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method == 'GET' && url == '/users') {
        return res
        .setHeader('Content-type', 'application/json') // Seta o cabeçalho para enviar JSON's 
        .end(JSON.stringify(users)) // JSON.stringify(users) | Transforma o array users em um JSON
    }
    if (method == 'POST' && url == '/users') {
        users.push({
        name: 'Nome Teste',
        id: 1,
        email: 'emailteste@teste.com.br'
        })
    
    
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