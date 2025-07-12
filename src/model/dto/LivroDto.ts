export class CadastrarLivroDTO {
    public titulo: string;
    public isbn: string;
    public autor: string;
    public editora: string;
    public edicao: string;
    public categoria_id: number;

    constructor(
        titulo: string,
        isbn: string,
        autor: string,
        editora: string,
        edicao: string,
        categoria_id: number
    ) {
        this.titulo = titulo;
        this.isbn = isbn;
        this.autor = autor;
        this.editora = editora;
        this.edicao = edicao;
        this.categoria_id = categoria_id;
    }
}

export class AtualizarLivroDTO {
    public titulo: string;
    public autor: string;
    public editora: string;
    public edicao: string;
    public categoria_id: number;

    constructor(
        titulo: string,
        autor: string,
        editora: string,
        edicao: string,
        categoria_id: number
    ) {
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.edicao = edicao;
        this.categoria_id = categoria_id;
    }
}