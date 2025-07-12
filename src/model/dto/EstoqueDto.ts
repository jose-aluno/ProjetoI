export class CadastrarEstoqueDTO {
    public livro_isbn: string;
    public quantidade: number;

    constructor(
        livro_isbn: string,
        quantidade: number
    ) {
        this.livro_isbn = livro_isbn;
        this.quantidade = quantidade;
    }
}