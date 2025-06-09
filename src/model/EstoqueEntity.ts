export class EstoqueEntity {
    id: number;
    livro_isbn: string;
    quantidade: number;
    quantidade_emprestada: number;
    disponivel: boolean;

    constructor(id: number | undefined, livro_isbn: string, quantidade: number, quantidade_emprestada: number) {
        this.id = id ?? this.gerarId();
        this.livro_isbn = livro_isbn;
        this.quantidade = quantidade;
        this.quantidade_emprestada = quantidade_emprestada;
        this.disponivel = this.calcularDisponibilidade();
    }

    private gerarId(): number {
        return parseInt((Date.now() / 100).toString(), 10);
    }

    public calcularDisponibilidade(): boolean {
        return this.quantidade - this.quantidade_emprestada > 0;
    }
}
