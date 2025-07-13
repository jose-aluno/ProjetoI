import { CategoriaLivroEntity } from "../model/entity/CategoriaLivroEntity";
import executarComandoSQL from "../database/mysql";

export class CategoriaLivroRepository {
    private static instance: CategoriaLivroRepository

    private constructor() {}

    async init() {
        await this.createTable();
    }

    public static getInstance(): CategoriaLivroRepository {
        if (!this.instance) {
            this.instance = new CategoriaLivroRepository()
        }
        return this.instance
    }

    private async createTable() {
        const query = `CREATE TABLE IF NOT EXISTS library.CategoriaLivro(
        id INT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL
        )`;
        try {
        await executarComandoSQL(query, []);
        console.log("Tabela CategoriaLivro criada com sucesso!!!");
        await this.insereCategoriasPadrao();
        } catch (err) {
        console.error(`Erro ao executar a query: ${err}`);
        }
    }

    private async insereCategoriasPadrao() {
        const resultado = await executarComandoSQL(`SELECT COUNT(*) as count FROM library.CategoriaLivro`, []);
        if (resultado[0].count > 0) {
        return;
        }
        
        const categorias = [
            { id: 1, nome: "Romance" },
            { id: 2, nome: "Computação" },
            { id: 3, nome: "Letras" },
            { id: 4, nome: "Gestão" }
        ];
        
        for (let i = 0; i < categorias.length; i++) {
        await executarComandoSQL(`INSERT INTO library.CategoriaLivro(id, nome) VALUES(?, ?)`, [categorias[i].id, categorias[i].nome]);
        }
    }

    public async listar(): Promise<CategoriaLivroEntity[]> {
        const resultado = await executarComandoSQL(`SELECT id, nome FROM library.CategoriaLivro ORDER BY nome`, []);
        
        return resultado.map((row: any) => 
            new CategoriaLivroEntity(row.id, row.nome)
        );
    }
}
