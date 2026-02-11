// ===============================
// IMPORTAÇÃO DO FILE SYSTEM (PROMISE-BASED)
// ===============================

// fs/promises fornece a API de filesystem baseada em Promises
// Isso evita callbacks e permite uso com async/await
// Estratégia moderna e alinhada com código assíncrono
import fs from 'node:fs/promises';

// ===============================
// DEFINIÇÃO DO CAMINHO DO BANCO
// ===============================

// new URL com import.meta.url garante:
// - Caminho absoluto
// - Independência do diretório onde o Node é executado
// - Compatibilidade com ES Modules
//
// Resultado: db.json sempre será resolvido corretamente
const dataBasePath = new URL('db.json', import.meta.url);

// ===============================
// CLASSE DATABASE
// ===============================

// Essa classe abstrai uma camada de persistência simples
// Baseada em arquivo JSON
//
// Conceito-chave:
// - Simula um banco de dados
// - Ideal para aprendizado
// - Não depende de libs externas
export class Database {

    // Campo privado (#):
    // - Só acessível dentro da classe
    // - Garante encapsulamento
    // - Evita mutações externas acidentais
    #database = {};

    // ===============================
    // CONSTRUTOR
    // ===============================

    constructor() {
        // Ao instanciar a classe:
        // Tentamos carregar o arquivo db.json para memória

        fs.readFile(dataBasePath, 'utf8')
            .then(data => {
                // Se o arquivo existir:
                // - Converte JSON em objeto JS
                // - Carrega tudo em memória
                this.#database = JSON.parse(data);
            })
            .catch(() => {
                // Se o arquivo não existir:
                // - Inicializamos o banco vazio
                // - Persistimos para criar o db.json
                this.#persist();
            });
    }

    // ===============================
    // MÉTODO PRIVADO DE PERSISTÊNCIA
    // ===============================

    async #persist() {
        // Responsabilidade:
        // - Sincronizar o estado em memória com o disco
        //
        // JSON.stringify:
        // - null → sem replacer
        // - 2 → identação (legibilidade para humanos)
        await fs.writeFile(
            dataBasePath,
            JSON.stringify(this.#database, null, 2)
        );
    }

    // ===============================
    // SELECT (READ)
// ===============================

    select(table, search) {
        // Busca os dados da "tabela"
        // Se a tabela não existir, retorna array vazio
        let data = this.#database[table] ?? [];

        // Se houver critério de busca:
        // aplicamos um filtro
        if (search) {
            data = data.filter(row => {
                // Object.entries transforma o objeto search em pares [key, value]
                // some() retorna true se QUALQUER campo bater
                return Object
                    .entries(search)
                    .some(([key, value]) => {
                        return row[key]
                            .toLowerCase()
                            .includes(value.toLowerCase());
                    });
            });
        }

        // Retorna os dados filtrados (ou completos)
        return data;
    }

    // ===============================
    // INSERT (CREATE)
    // ===============================

    insert(table, data) {
        // Se a tabela já existir:
        // apenas adicionamos o novo registro
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            // Caso contrário:
            // criamos a tabela com o primeiro registro
            this.#database[table] = [data];
        }

        // Persistimos a alteração no disco
        this.#persist();

        // Retornamos o dado inserido
        // Útil para controllers
        return data;
    }

    // ===============================
    // UPDATE
    // ===============================

    update(table, id, data) {
        // Localiza o índice do registro pelo ID
        const rowIndex = this.#database[table]
            .findIndex(row => row.id == id);

        // Se o registro existir:
        if (rowIndex > -1) {
            // Substitui o objeto inteiro
            // Mantendo o id como fonte de verdade
            this.#database[table][rowIndex] = { id, ...data };

            // Persiste a mudança
            this.#persist();
        }
    }

    // ===============================
    // DELETE
    // ===============================

    delete(table, id) {
        // Localiza o índice do registro
        const rowIndex = this.#database[table]
            .findIndex(row => row.id == id);

        // Se encontrado:
        if (rowIndex > -1) {
            // Remove exatamente um elemento
            this.#database[table].splice(rowIndex, 1);

            // Persiste o estado atualizado
            this.#persist();
        }
    }
}
