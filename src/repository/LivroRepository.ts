import { LivroEntity } from "../model/entity/LivroEntity"
import executarComandoSQL from "../database/mysql";

export class LivroRepository {
    private static instance: LivroRepository

    private constructor() {}

    async init() {
        await this.createTable();
    }

    public static getInstance(): LivroRepository {
        if (!this.instance) {
            this.instance = new LivroRepository()
        }
        return this.instance
    }

    private async createTable() {
        const query = `CREATE TABLE IF NOT EXISTS library.Livro(
            id INT AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(200) NOT NULL,
            autor VARCHAR(150) NOT NULL,
            editora VARCHAR(100) NOT NULL,
            edicao VARCHAR(50) NOT NULL,
            isbn VARCHAR(20) UNIQUE NOT NULL,
            categoria_id INT NOT NULL
        )`;
        try {
        await executarComandoSQL(query, []);
        console.log("Tabela Livro criada com sucesso!!!");
        } catch (err) {
        console.error(`Erro ao executar a query: ${err}`);
        }
    }

    async inserir(livro: LivroEntity): Promise<void> {
        const query = `INSERT INTO library.Livro(titulo, autor, editora, edicao, isbn, categoria_id) VALUES(?, ?, ?, ?, ?, ?)`;
        try {
            await executarComandoSQL(query, [livro.titulo, livro.autor, livro.editora, livro.edicao, livro.isbn, livro.categoria_id]);
        } catch (err) {
            console.error(`Erro ao inserir livro: ${err}`);
            throw err;
        }
    }

    async listar(): Promise<LivroEntity[]> {
        const resultado = await executarComandoSQL(`SELECT id, titulo, autor, editora, edicao, isbn, categoria_id FROM library.Livro ORDER BY titulo`, []);
        
        return resultado.map((row: any) => 
            new LivroEntity(row.id, row.titulo, row.autor, row.editora, row.edicao, row.isbn, row.categoria_id)
        );
    }

    async buscarPorISBN(isbn: string): Promise<LivroEntity | undefined> {
        const resultado = await executarComandoSQL(`SELECT id, titulo, autor, editora, edicao, isbn, categoria_id FROM library.Livro WHERE isbn = ?`, [isbn]);
        
        if (resultado.length === 0) {
            return undefined;
        }
        
        const row = resultado[0];
        return new LivroEntity(row.id, row.titulo, row.autor, row.editora, row.edicao, row.isbn, row.categoria_id);
    }

    async atualizar(isbn: string, titulo: string, autor: string, editora: string, edicao: string, categoria_id: number): Promise<boolean> {
        const query = `UPDATE library.Livro SET titulo = ?, autor = ?, editora = ?, edicao = ?, categoria_id = ? WHERE isbn = ?`;
        try {
            const resultado = await executarComandoSQL(query, [titulo, autor, editora, edicao, categoria_id, isbn]);
            return resultado.affectedRows > 0;
        } catch (err) {
            console.error(`Erro ao atualizar livro: ${err}`);
            return false;
        }
    }

    async remover(isbn: string): Promise<boolean> {
        const query = `DELETE FROM library.Livro WHERE isbn = ?`;
        try {
            const resultado = await executarComandoSQL(query, [isbn]);
            return resultado.affectedRows > 0;
        } catch (err) {
            console.error(`Erro ao remover livro: ${err}`);
            return false;
        }
    }
}