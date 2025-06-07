import { Estoque } from "../model/EstoqueEntity"

export class EstoqueRepository {
    private static instance: EstoqueRepository
    private estoqueList: Estoque[] = []

    private constructor() {}

    public static getInstance(): EstoqueRepository {
        if (!this.instance) {
            this.instance = new EstoqueRepository()
        }
        return this.instance
    }

    inserir(estoque: Estoque) {
        this.estoqueList.push(estoque)
    }

    listar(): Estoque[] {
        return this.estoqueList
    }

    buscarPorId(id: number): Estoque | undefined {
        return this.estoqueList.find(e => e.id === id)
    }

    atualizar(id: number, livro_id: number, quantidade: number, quantidade_emprestada: number, disponivel: boolean): boolean {
        const estoque = this.buscarPorId(id)
        if (!estoque) return false

        estoque.livro_id = livro_id
        estoque.quantidade = quantidade
        estoque.quantidade_emprestada = quantidade_emprestada
        estoque.disponivel = disponivel

        return true
    }

    remover(id: number): boolean {
        const index = this.estoqueList.findIndex(e => e.id === id)
        if (index >= 0) {
            this.estoqueList.splice(index, 1)
            return true
        }
        return false
    }
}
