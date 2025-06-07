import { EstoqueEntity } from "../model/EstoqueEntity"
import { EstoqueRepository } from "../repository/EstoqueRepository"

export class EstoqueService {
    private estoqueRepository = EstoqueRepository.getInstance()

    cadastrarEstoque(dados: any): EstoqueEntity {
        const { livro_id, quantidade } = dados

        if (!livro_id || quantidade === undefined) {
            throw new Error("Campos 'livro_id' e 'quantidade' são obrigatórios.")
        }

        const novoEstoque = new EstoqueEntity(
            undefined,
            livro_id,
            quantidade,
            0, 
            quantidade > 0 
        )

        this.estoqueRepository.inserir(novoEstoque)
        return novoEstoque
    }

    listarEstoques(): EstoqueEntity[] {
        return this.estoqueRepository.listar()
    }

    buscarPorId(id: number): EstoqueEntity | undefined {
        return this.estoqueRepository.buscarPorId(id)
    }

    atualizarEstoque(id: number, dados: any): boolean {
        const { livro_id, quantidade, quantidade_emprestada, disponivel } = dados

        if (
            livro_id === undefined ||
            quantidade === undefined ||
            quantidade_emprestada === undefined ||
            disponivel === undefined
        ) {
            throw new Error("Todos os campos obrigatórios devem ser informados.")
        }

        return this.estoqueRepository.atualizar(id, livro_id, quantidade, quantidade_emprestada, disponivel)
    }

    removerEstoque(id: number): boolean {
        return this.estoqueRepository.remover(id)
    }
}
