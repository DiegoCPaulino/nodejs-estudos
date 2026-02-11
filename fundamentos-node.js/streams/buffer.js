// ===============================
// CONCEITO CENTRAL
// ===============================
//
// Buffer é a estrutura usada pelo Node.js
// para representar dados binários na memória.
//
// Streams, arquivos, sockets, HTTP, tudo
// trabalha com Buffer por baixo dos panos.
//
// Buffer NÃO é:
// - Array comum
// - String
//
// Buffer É:
// - Um bloco de memória alocado
// - Uma sequência de bytes (números de 0 a 255)

// ===============================
// CRIAÇÃO DE UM BUFFER
// ===============================

// Buffer.from cria um Buffer a partir de dados existentes
// Neste caso, uma string
//
// Por padrão, a string é convertida usando UTF-8
const buf = Buffer.from("Hello World!");

// ===============================
// INSPEÇÃO DO BUFFER
// ===============================

// Exibir o buffer diretamente no console
// O Node mostra os valores em hexadecimal
// Exemplo: <Buffer 48 65 6c 6c 6f ...>
console.log(buf);

// ===============================
// REPRESENTAÇÃO EM JSON
// ===============================

// toJSON NÃO converte o conteúdo em string
// Ele converte o buffer em uma estrutura serializável
// composta por:
//
// {
//   type: 'Buffer',
//   data: [72, 101, 108, 108, 111, ...]
// }
//
// Esses números representam os bytes
// correspondentes aos caracteres UTF-8
console.log(buf.toJSON());
