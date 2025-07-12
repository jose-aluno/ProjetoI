export class LivroEntity {
    id: number
    titulo: string
    isbn: string
    autor: string
    editora: string
    edicao: string
    categoria_id: number

    constructor(id: number | undefined, titulo: string, isbn: string, autor: string, editora: string, edicao: string, categoria_id: number) {
        this.id = id ?? this.gerarId()
        this.titulo = titulo
        this.isbn = isbn
        this.autor = autor
        this.editora = editora
        this.edicao = edicao
        this.categoria_id = categoria_id
    }

    private gerarId(): number {
        return parseInt((Date.now() / 100).toString(), 10)
    }
}
