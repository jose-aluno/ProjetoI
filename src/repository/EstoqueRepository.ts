import { EstoqueEntity } from "../model/entity/EstoqueEntity";
import executarComandoSQL from "../database/mysql";

export class EstoqueRepository {
    private static instance: EstoqueRepository;

    private constructor() {}

    async init() {
        await this.createTable();
    }

    public static getInstance(): EstoqueRepository {
        if (!this.instance) {
            this.instance = new EstoqueRepository();
        }
        return this.instance;
    }

    private async createTable() {
        const query = `CREATE TABLE IF NOT EXISTS library.Estoque(
            id INT AUTO_INCREMENT PRIMARY KEY,
            livro_isbn VARCHAR(20) NOT NULL,
            quantidade INT NOT NULL DEFAULT 0,
            quantidade_emprestada INT NOT NULL DEFAULT 0,
            disponivel BOOLEAN NOT NULL DEFAULT true,
            INDEX idx_livro_isbn (livro_isbn),
            INDEX idx_disponivel (disponivel)
        )`;
        try {
            await executarComandoSQL(query, []);
            console.log("Tabela Estoque criada com sucesso!!!");
        } catch (err) {
            console.error(`Erro ao executar a query: ${err}`);
        }
    }

    async inserir(estoque: EstoqueEntity): Promise<void> {
        const query = `INSERT INTO library.Estoque(livro_isbn, quantidade, quantidade_emprestada, disponivel) VALUES(?, ?, ?, ?)`;
        try {
            await executarComandoSQL(query, [
                estoque.livro_isbn, 
                estoque.quantidade, 
                estoque.quantidade_emprestada, 
                estoque.calcularDisponibilidade()
            ]);
        } catch (err) {
            console.error(`Erro ao inserir estoque: ${err}`);
            throw err;
        }
    }

    async listar(): Promise<EstoqueEntity[]> {
        const resultado = await executarComandoSQL(
            `SELECT id, livro_isbn, quantidade, quantidade_emprestada, disponivel FROM library.Estoque ORDER BY livro_isbn`, 
            []
        );
        
        return resultado.map((row: any) => {
            const estoque = new EstoqueEntity(
                row.id, 
                row.livro_isbn, 
                row.quantidade, 
                row.quantidade_emprestada
            );
            return estoque;
        });
    }

    async buscarPorId(id: number): Promise<EstoqueEntity | undefined> {
        const resultado = await executarComandoSQL(
            `SELECT id, livro_isbn, quantidade, quantidade_emprestada, disponivel FROM library.Estoque WHERE id = ?`, 
            [id]
        );
        
        if (resultado.length === 0) {
            return undefined;
        }
        
        const row = resultado[0];
        const estoque = new EstoqueEntity(
            row.id, 
            row.livro_isbn, 
            row.quantidade, 
            row.quantidade_emprestada
        );
        return estoque;
    }

    async buscarPorISBN(isbn: string): Promise<EstoqueEntity | undefined> {
        const resultado = await executarComandoSQL(
            `SELECT id, livro_isbn, quantidade, quantidade_emprestada, disponivel FROM library.Estoque WHERE livro_isbn = ?`, 
            [isbn]
        );
        
        if (resultado.length === 0) {
            return undefined;
        }
        
        const row = resultado[0];
        const estoque = new EstoqueEntity(
            row.id, 
            row.livro_isbn, 
            row.quantidade, 
            row.quantidade_emprestada
        );
        return estoque;
    }

    async listarDisponiveis(): Promise<EstoqueEntity[]> {
        const resultado = await executarComandoSQL(
            `SELECT id, livro_isbn, quantidade, quantidade_emprestada, disponivel FROM library.Estoque WHERE disponivel = true ORDER BY livro_isbn`, 
            []
        );
        
        return resultado.map((row: any) => {
            const estoque = new EstoqueEntity(
                row.id, 
                row.livro_isbn, 
                row.quantidade, 
                row.quantidade_emprestada
            );
            return estoque;
        });
    }

    async atualizar(id: number, livro_isbn: string, quantidade: number, quantidade_emprestada: number, disponivel: boolean): Promise<boolean> {
        // Criar uma instância temporária para calcular a disponibilidade
        const estoqueTemp = new EstoqueEntity(id, livro_isbn, quantidade, quantidade_emprestada);
        const disponibilidadeCalculada = estoqueTemp.calcularDisponibilidade();
        
        const query = `UPDATE library.Estoque SET livro_isbn = ?, quantidade = ?, quantidade_emprestada = ?, disponivel = ? WHERE id = ?`;
        try {
            const resultado = await executarComandoSQL(query, [
                livro_isbn, 
                quantidade, 
                quantidade_emprestada, 
                disponibilidadeCalculada, 
                id
            ]);
            return resultado.affectedRows > 0;
        } catch (err) {
            console.error(`Erro ao atualizar estoque: ${err}`);
            return false;
        }
    }

    async atualizarQuantidade(id: number, quantidade: number, quantidade_emprestada: number): Promise<boolean> {
        // Criar uma instância temporária para calcular a disponibilidade
        const estoqueTemp = new EstoqueEntity(id, "", quantidade, quantidade_emprestada);
        const disponibilidadeCalculada = estoqueTemp.calcularDisponibilidade();
        
        const query = `UPDATE library.Estoque SET quantidade = ?, quantidade_emprestada = ?, disponivel = ? WHERE id = ?`;
        try {
            const resultado = await executarComandoSQL(query, [
                quantidade, 
                quantidade_emprestada, 
                disponibilidadeCalculada, 
                id
            ]);
            return resultado.affectedRows > 0;
        } catch (err) {
            console.error(`Erro ao atualizar quantidade do estoque: ${err}`);
            return false;
        }
    }

    async remover(id: number): Promise<boolean> {
        const query = `DELETE FROM library.Estoque WHERE id = ?`;
        try {
            const resultado = await executarComandoSQL(query, [id]);
            return resultado.affectedRows > 0;
        } catch (err) {
            console.error(`Erro ao remover estoque: ${err}`);
            return false;
        }
    }
}