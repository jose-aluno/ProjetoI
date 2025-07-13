import { CategoriaUsuarioEntity } from "../model/entity/CategoriaUsuarioEntity";
import executarComandoSQL from "../database/mysql";

export class CategoriaUsuarioRepository {
    private static instance: CategoriaUsuarioRepository

    private constructor() {}

    async init() {
        await this.createTable();
    }

    public static getInstance(): CategoriaUsuarioRepository {
        if (!this.instance) {
            this.instance = new CategoriaUsuarioRepository()
        }
        return this.instance
    }

    private async createTable() {
        const query = `CREATE TABLE IF NOT EXISTS library.CategoriaUsuario(
        id INT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL
        )`;
        try {
        await executarComandoSQL(query, []);
        console.log("Tabela CategoriaUsuario criada com sucesso!!!");
        await this.insereCategoriasPadrao();
        } catch (err) {
        console.error(`Erro ao executar a query: ${err}`);
        }
    }

    private async insereCategoriasPadrao() {
        const resultado = await executarComandoSQL(`SELECT COUNT(*) as count FROM library.CategoriaUsuario`, []);
        if (resultado[0].count > 0) {
        return;
        }
        
        const categorias = [
            { id: 1, nome: "Professor" },
            { id: 2, nome: "Aluno" },
            { id: 3, nome: "Bibliotecário" }
        ];
        
        for (let i = 0; i < categorias.length; i++) {
        await executarComandoSQL(`INSERT INTO library.CategoriaUsuario(id, nome) VALUES(?, ?)`, [categorias[i].id, categorias[i].nome]);
        }
    }

    public async listar(): Promise<CategoriaUsuarioEntity[]> {
        const resultado = await executarComandoSQL(`SELECT id, nome FROM library.CategoriaUsuario ORDER BY nome`, []);
        
        return resultado.map((row: any) => 
            new CategoriaUsuarioEntity(row.id, row.nome)
        );
    }
}