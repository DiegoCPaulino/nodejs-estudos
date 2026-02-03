// ===============================
// IMPORTAÇÃO DA READABLE STREAM
// ===============================

// Readable será usada como corpo da requisição
// Isso é MUITO poderoso:
// você está enviando dados em streaming via HTTP
import { Readable } from "node:stream"

// ===============================
// READABLE STREAM CUSTOMIZADA
// ===============================

class OneToHundredStream extends Readable {
    index = 1
    
    _read() {
        const i = this.index++

        // Simula uma fonte lenta de dados
        // Muito parecido com:
        // - upload de arquivo
        // - leitura de sensor
        // - streaming de dados em tempo real
        setTimeout(() => {
            if (i > 5) {
                // push(null) encerra a stream
                this.push(null)
            } else {
                // Conversão obrigatória para Buffer
                const buf = Buffer.from(String(i))

                // Envia o chunk para o consumidor
                this.push(buf)
            }
        }, 1000)
    }
}

// ===============================
// FETCH COM STREAM NO BODY
// ===============================

// Aqui estamos fazendo algo AVANÇADO:
// - Usar fetch
// - Enviar uma Readable Stream como body
fetch('http://localhost:3334', {
    method: 'POST',

    // O body NÃO é string nem JSON
    // É uma stream viva
    body: new OneToHundredStream(),

    // Obrigatório no Node.js quando usamos stream no body
    // Informa que o corpo será enviado em streaming
    duplex: 'half'
})
.then(response => {
    // response.text() consome o corpo da resposta
    // Internamente, também é uma stream
    return response.text()
})
.then(data => {
    // Exibe o que o servidor devolveu
    console.log(data)
})