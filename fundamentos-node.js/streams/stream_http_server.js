// ===============================
// IMPORTAÇÕES CORE DO NODE
// ===============================

// http é o módulo nativo responsável por:
// - Criar servidores HTTP
// - Lidar com requests (req) e responses (res)
// IMPORTANTE: req e res SÃO STREAMS
import http from 'node:http'

// Transform é usada para criar streams intermediárias
// que leem, transformam e escrevem dados
import { Transform } from "node:stream"

// ===============================
// TRANSFORM STREAM (não usada ainda)
// ===============================
// Essa classe demonstra como seria possível
// transformar dados NO MEIO do request
// (ex: logs, validação, parsing, etc)

class InverseNumberStream extends Transform {
    _transform(chunk, encoding, callback) {
        // chunk chega como Buffer
        // encoding normalmente é 'buffer'

        const transformed = Number(chunk.toString()) * -1

        // Log para debug / observabilidade
        console.log(transformed)

        // callback envia o novo chunk transformado
        callback(null, Buffer.from(String(transformed)))
    }
}

// ===============================
// CRIAÇÃO DO SERVIDOR HTTP
// ===============================

// createServer recebe uma função callback
// Essa função roda A CADA request recebido
const server = http.createServer(async (req, res) => {

    // Array para armazenar os pedaços (chunks)
    // que chegam do corpo da requisição
    const buffers = []

    // req é uma Readable Stream
    // for await...of consome a stream de forma assíncrona
    // Esse padrão só funciona porque streams
    // implementam Async Iterators
    for await (const chunk of req) {
        buffers.push(chunk)
    }

    // Aqui estamos:
    // - juntando todos os Buffers
    // - convertendo para string
    // ATENÇÃO: isso quebra o conceito de streaming
    // porque traz tudo para memória
    const fullStreamContent = Buffer.concat(buffers).toString()

    // Log para inspeção
    console.log(fullStreamContent)

    // res.end finaliza a resposta HTTP
    // e envia o conteúdo para o cliente
    return res.end(fullStreamContent)
})

// ===============================
// SERVER BOOTSTRAP
// ===============================

// O servidor começa a escutar na porta 3334
// Esse processo fica vivo até ser encerrado
server.listen(3334)