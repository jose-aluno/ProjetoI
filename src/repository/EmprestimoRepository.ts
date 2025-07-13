import { EmprestimoEntity } from "../model/entity/EmprestimoEntity"
import executarComandoSQL from "../database/mysql"

export class EmprestimoRepository {
    private static instance: EmprestimoRepository

    private constructor() {}

    async init() {
        await this.createTable();
    }

    public static getInstance(): EmprestimoRepository {
        if (!this.instance) {
            this.instance = new EmprestimoRepository()
        }
        return this.instance
    }

    private async createTable() {
        const query = `CREATE TABLE IF NOT EXISTS library.Emprestimo (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_cpf VARCHAR(11) NOT NULL,
            estoque_id INT NOT NULL,
            data_emprestimo DATETIME NOT NULL,
            data_devolucao DATETIME NOT NULL,
            data_entrega DATETIME NULL,
            dias_atraso INT DEFAULT 0,
            suspensao_ate DATETIME NULL
        );`;
        try {
            await executarComandoSQL(query, []);
            console.log("Tabela Emprésimo criada com sucesso!!!");
        } catch (err) {
            console.error(`Erro ao executar a query: ${err}`);
        }
    }

    async inserir(emprestimo: EmprestimoEntity): Promise<EmprestimoEntity> {
        const query = `
            INSERT INTO library.Emprestimo (usuario_cpf, estoque_id, data_emprestimo, data_devolucao, data_entrega, dias_atraso, suspensao_ate)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `
        const valores = [
            emprestimo.usuario_cpf,
            emprestimo.estoque_id,
            emprestimo.data_emprestimo,
            emprestimo.data_devolucao,
            emprestimo.data_entrega,
            emprestimo.dias_atraso,
            emprestimo.suspensao_ate
        ]

        const resultado = await executarComandoSQL(query, valores)
        emprestimo.id = resultado.insertId
        return emprestimo
    }

    async listar(): Promise<EmprestimoEntity[]> {
        const query = "SELECT * FROM library.Emprestimo"
        const resultado = await executarComandoSQL(query, [])
        
        return resultado.map((row: any) => new EmprestimoEntity(
            row.id,
            row.usuario_cpf,
            row.estoque_id,
            row.data_emprestimo,
            row.data_devolucao,
            row.data_entrega,
            row.dias_atraso,
            row.suspensao_ate
        ))
    }

    async buscarPorId(id: number): Promise<EmprestimoEntity | undefined> {
        const query = "SELECT * FROM library.Emprestimo WHERE id = ?"
        const resultado = await executarComandoSQL(query, [id])
        
        if (resultado.length === 0) {
            return undefined
        }

        const row = resultado[0]
        return new EmprestimoEntity(
            row.id,
            row.usuario_cpf,
            row.estoque_id,
            row.data_emprestimo,
            row.data_devolucao,
            row.data_entrega,
            row.dias_atraso,
            row.suspensao_ate
        )
    }

    async atualizar(id: number, usuario_cpf: string, estoque_id: number, data_emprestimo: Date, data_devolucao: Date, data_entrega: Date | null, dias_atraso: number, suspensao_ate: Date | null): Promise<boolean> {
        const query = `
            UPDATE library.Emprestimo
            SET usuario_cpf = ?, estoque_id = ?, data_emprestimo = ?, data_devolucao = ?, data_entrega = ?, dias_atraso = ?, suspensao_ate = ?
            WHERE id = ?
        `
        const valores = [
            usuario_cpf,
            estoque_id,
            data_emprestimo,
            data_devolucao,
            data_entrega,
            dias_atraso,
            suspensao_ate,
            id
        ]

        const resultado = await executarComandoSQL(query, valores)
        return resultado.affectedRows > 0
    }

    async buscarAtrasadosNaoDevolvidos(limit: number, offset: number): Promise<EmprestimoEntity[]> {
        const query = `
            SELECT * FROM library.Emprestimo
            WHERE data_entrega IS NULL 
            AND data_devolucao < NOW() 
            AND suspensao_ate IS NULL
            LIMIT ? OFFSET ?
        `
        const resultado = await executarComandoSQL(query, [limit, offset])
        
        return resultado.map((row: any) => new EmprestimoEntity(
            row.id,
            row.usuario_cpf,
            row.estoque_id,
            row.data_emprestimo,
            row.data_devolucao,
            row.data_entrega,
            row.dias_atraso,
            row.suspensao_ate
        ))
    }

    async contarEmprestimosAtrasados(cpf: string): Promise<number> {
        const query = `
            SELECT COUNT(*) as count FROM library.Emprestimo
            WHERE usuario_cpf = ? 
            AND data_entrega IS NULL 
            AND data_devolucao < NOW()
        `
        const resultado = await executarComandoSQL(query, [cpf])
        return resultado[0].count
    }
}