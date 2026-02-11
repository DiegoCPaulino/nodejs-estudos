// ===============================
// CONTEXTO DO ARQUIVO
// ===============================
// Esse arquivo implementa um "JSON body parser" manual.
// É exatamente o tipo de coisa que frameworks como
// Express, Fastify e Nest escondem de você.
//
// Aqui, você está lidando:
// - Diretamente com streams
// - Diretamente com buffers
// - Diretamente com parsing de payload HTTP
//
// Ou seja: camada FUNDAMENTAL do backend.

// ===============================
// FUNÇÃO EXPORTADA
// ===============================

// Essa função foi pensada para ser usada como middleware.
// Ela intercepta req e res ANTES da lógica de negócio.
//
// Padrão mental:
// Request entra → middlewares processam → controller usa req.body
export async function json(req, res) {

    // ===============================
    // COLETA DOS DADOS DO REQUEST BODY
    // ===============================

    // Array que irá armazenar os chunks do corpo da requisição
    // Cada chunk é um Buffer
    const buffers = [];

    // req é uma Readable Stream
    // for await...of consome a stream de forma assíncrona
    //
    // Esse loop:
    // - pausa automaticamente quando não há dados
    // - respeita backpressure
    // - encerra quando a stream finaliza (push(null))
    for await (const chunk of req) {
        buffers.push(chunk);
    }

    // ===============================
    // PARSING DO JSON
    // ===============================

    try {
        // Buffer.concat une todos os chunks em um único Buffer
        // toString converte os bytes em texto
        // JSON.parse transforma texto em objeto JavaScript

        // Resultado final:
        // req.body passa a existir e conter o payload parseado
        req.body = JSON.parse(
            Buffer.concat(buffers).toString()
        );
    } catch {
        // Se o JSON for inválido:
        // - payload malformado
        // - body vazio
        // - erro de parsing
        //
        // Evitamos quebrar a aplicação
        // e deixamos o body explícito como null
        req.body = null;
    }

    // ===============================
    // CONFIGURAÇÃO DA RESPONSE
    // ===============================

    // Define o tipo de conteúdo da resposta
    // Isso informa ao cliente que a API
    // trabalha com JSON por padrão
    res.setHeader('Content-type', 'application/json');
}