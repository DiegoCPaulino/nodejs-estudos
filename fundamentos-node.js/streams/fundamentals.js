// ===============================
// CONCEITO GERAL
// ===============================
// Streams no Node.js são abstrações para processar dados de forma incremental,
// sem precisar carregar tudo na memória.
// Isso é FUNDAMENTAL para:
// - Performance
// - Escalabilidade
// - Processamento de grandes volumes de dados (big data, arquivos, rede, etc)

// Tipos principais de Streams:
// - Readable: fonte de dados (entrada)
// - Writable: destino dos dados (saída)
// - Transform: intermediário que lê e escreve, transformando os dados
// - Duplex: lê e escreve, mas sem relação direta entre entrada e saída

// OBS IMPORTANTE:
// No Node.js, praticamente TODA entrada e saída é baseada em Streams:
// arquivos, HTTP, stdin, stdout, sockets, etc.

// ===============================
// IMPORTAÇÃO DAS CLASSES BASE
// ===============================

import { Readable, Writable, Transform, Duplex } from 'node:stream'

// Essas classes são ABSTRAÇÕES.
// Você não usa streams "cruas", você EXTENDE essas classes
// e implementa os métodos internos (_read, _write, _transform).

// ===============================
// READABLE STREAM
// ===============================
// Responsabilidade: PRODUZIR dados

class OneToHundredStream extends Readable {
    // index controla o estado interno da stream
    // Streams SÃO stateful (mantêm estado)
    index = 1
    
    // _read é chamado automaticamente pelo Node
    // quando alguém tenta CONSUMIR a stream
    _read() {
        const i = this.index++

        // setTimeout simula uma fonte lenta de dados
        // Exemplo real:
        // - Leitura de arquivo grande
        // - Dados vindos da rede
        // - Leitura de banco
        setTimeout(() => {
            if (i > 100) {
                // push(null) é o sinal oficial de:
                // "acabaram os dados"
                // Isso dispara o evento 'end'
                this.push(null)
            } else {
                // Streams NÃO trabalham com tipos primitivos
                // Tudo precisa ser Buffer ou Uint8Array

                // Aqui:
                // - convertemos o número para string
                // - depois para Buffer
                const buf = Buffer.from(String(i))

                // push envia o chunk para quem estiver consumindo
                // Esse método NÃO imprime, NÃO retorna
                // Ele apenas EMPURRA dados para o pipeline
                this.push(buf)
            }
        }, 1000)
    }
}

// ===============================
// WRITABLE STREAM
// ===============================
// Responsabilidade: CONSUMIR dados
// Writable NÃO retorna nada
// Ela apenas PROCESSA o que recebe

class MultiplyByTenStream extends Writable {
    // _write é chamado automaticamente
    // sempre que um chunk chega da stream anterior
    _write(chunk, encoding, callback) {
        // chunk é um Buffer
        // encoding geralmente é 'buffer'
        // callback DEVE ser chamado para liberar o fluxo

        // Convertendo Buffer → String → Number
        const number = Number(chunk.toString())

        // Aqui estamos aplicando a regra de negócio
        // (multiplicar por 10)
        console.log(number * 10)

        // callback avisa:
        // "terminei de processar esse chunk,
        // pode mandar o próximo"
        callback()
    }
}

// ===============================
// TRANSFORM STREAM
// ===============================
// Responsabilidade: INTERMEDIAR
// Ela lê, transforma e escreve

class InverseNumber extends Transform {
    _transform(chunk, encoding, callback) {
        // Transform recebe um chunk,
        // aplica uma transformação
        // e devolve outro chunk

        const number = Number(chunk.toString())

        // Regra de negócio:
        // inverter o sinal
        const transformed = number * -1

        // callback recebe:
// - erro (null se não houver)
// - novo chunk (Buffer)
        callback(null, Buffer.from(String(transformed)))
    }
}

// ===============================
// PIPELINE DE STREAMS
// ===============================

// Aqui estamos criando um pipeline de dados:
//
// OneToHundredStream
// → InverseNumber
// → MultiplyByTenStream
//
// Fluxo:
// 1 → -1 → -10
// 2 → -2 → -20
// ...

new OneToHundredStream()
    .pipe(new InverseNumber())
    .pipe(new MultiplyByTenStream())

// pipe faz 3 coisas automaticamente:
// 1. Conecta streams
// 2. Controla backpressure (fluxo)
// 3. Gerencia eventos de erro e encerramento