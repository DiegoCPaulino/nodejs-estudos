import fs from 'node:fs/promises'

const dataBasePath = new URL('db.json', import.meta.url)

export class Database {
    #database = {}

    async #persist() {
    await fs.writeFile(
        dataBasePath,
        JSON.stringify(this.#database, null, 2)
    )
}


    select(table) {
        const data = this.#database[table] ?? [];

        return data;
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()
        return data;
    }
}