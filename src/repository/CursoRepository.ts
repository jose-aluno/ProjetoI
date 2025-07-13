import { CursoEntity } from "../model/entity/CursoEntity";
import executarComandoSQL from "../database/mysql";

export class CursoRepository {
    private static instance: CursoRepository

    private constructor() {}

    async init() {
        await this.createTable();
    }

    public static getInstance(): CursoRepository {
        if (!this.instance) {
            this.instance = new CursoRepository()
        }
        return this.instance;
    }

    private async createTable() {
        const query = `CREATE TABLE IF NOT EXISTS library.Curso(
        id INT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL
        )`;
        try {
        await executarComandoSQL(query, []);
        console.log("Tabela Curso criada com sucesso!!!");
        await this.insereCursosPadrao();
        } catch (err) {
        console.error(`Erro ao executar a query: ${err}`);
        }
    }

    private async insereCursosPadrao() {
        const resultado = await executarComandoSQL(`SELECT COUNT(*) as count FROM library.Curso`, []);
        if (resultado[0].count > 0) {
        return;
        }
        
        const cursos = [
            { id: 2, nome: "ADS" },
            { id: 3, nome: "Pedagogia" },
            { id: 4, nome: "Administração" }
        ];
        
        for (let i = 0; i < cursos.length; i++) {
        await executarComandoSQL(`INSERT INTO library.Curso(id, nome) VALUES(?, ?)`, [cursos[i].id, cursos[i].nome]);
        }
    }

    public async listar(): Promise<CursoEntity[]> {
        const resultado = await executarComandoSQL(`SELECT id, nome FROM library.Curso ORDER BY nome`, []);
        
        return resultado.map((row: any) => 
            new CursoEntity(row.id, row.nome)
        );
    }
}