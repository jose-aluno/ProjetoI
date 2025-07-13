import { UsuarioEntity } from "../model/entity/UsuarioEntity"
import executarComandoSQL from "../database/mysql";

export class UsuarioRepository {
    private static instance: UsuarioRepository

    private constructor() {}

    async init() {
        await this.createTable();
    }

    public static getInstance(): UsuarioRepository {
        if (!this.instance) {
            this.instance = new UsuarioRepository()
        }
        return this.instance
    }

    private async createTable() {
        const query = `CREATE TABLE IF NOT EXISTS library.Usuario(
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        email VARCHAR(100) NOT NULL,
        status INT DEFAULT 1,
        categoria_id INT NOT NULL,
        curso_id INT NOT NULL,
        FOREIGN KEY (categoria_id) REFERENCES CategoriaUsuario(id),
        FOREIGN KEY (curso_id) REFERENCES Curso(id)
        )`;
        try {
            await executarComandoSQL(query, []);
            console.log("Tabela Usuario criada com sucesso!!!");
        } catch (err) {
            console.error(`Erro ao executar a query: ${err}`);
        }
    }

    async inserir(usuario: UsuarioEntity): Promise<void> {
        const query = `INSERT INTO library.Usuario(nome, cpf, email, status, categoria_id, curso_id) VALUES(?, ?, ?, ?, ?, ?)`;
        try {
            await executarComandoSQL(query, [usuario.nome, usuario.cpf, usuario.email, usuario.status, usuario.categoria_id, usuario.curso_id]);
        } catch (err) {
            console.error(`Erro ao inserir usuário: ${err}`);
            throw err;
        }
    }

    async listar(): Promise<UsuarioEntity[]> {
        const resultado = await executarComandoSQL(`SELECT id, nome, cpf, email, status, categoria_id, curso_id FROM library.Usuario ORDER BY nome`, []);
        
        return resultado.map((row: any) => 
            new UsuarioEntity(row.id, row.nome, row.cpf, row.email, row.status, row.categoria_id, row.curso_id)
        );
    }

    async buscarPorCPF(cpf: string): Promise<UsuarioEntity | undefined> {
        const resultado = await executarComandoSQL(`SELECT id, nome, cpf, email, status, categoria_id, curso_id FROM library.Usuario WHERE cpf = ?`, [cpf]);
        
        if (resultado.length === 0) {
            return undefined;
        }
        
        const row = resultado[0];
        return new UsuarioEntity(row.id, row.nome, row.cpf, row.email, row.status, row.categoria_id, row.curso_id);
    }

    async atualizar(cpf: string, nome: string, status: number, email: string, categoria_id: number, curso_id: number): Promise<boolean> {
        const query = `UPDATE library.Usuario SET nome = ?, status = ?, email = ?, categoria_id = ?, curso_id = ? WHERE cpf = ?`;
        try {
            const resultado = await executarComandoSQL(query, [nome, status, email, categoria_id, curso_id, cpf]);
            return resultado.affectedRows > 0;
        } catch (err) {
            console.error(`Erro ao atualizar usuário: ${err}`);
            return false;
        }
    }

    async remover(cpf: string): Promise<boolean> {
        const query = `DELETE FROM library.Usuario WHERE cpf = ?`;
        try {
            const resultado = await executarComandoSQL(query, [cpf]);
            return resultado.affectedRows > 0;
        } catch (err) {
            console.error(`Erro ao remover usuário: ${err}`);
            return false;
        }
    }
}