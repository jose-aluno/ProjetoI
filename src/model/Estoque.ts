export class Estoque {
    id: number
    livro_id: number
    quantidade: number
    quantidade_emprestada: number
    disponivel: boolean

    constructor(id: number, livro_id: number, quantidade: number, quantidade_emprestada: number, disponivel: boolean) {
        this.id = id ?? this.gerarId()
        this.livro_id = livro_id
        this.quantidade = quantidade
        this.quantidade_emprestada = quantidade_emprestada
        this.disponivel = disponivel
    }

    private gerarId(): number {
        return parseInt((Date.now() /100).toString(), 10)
    }
}