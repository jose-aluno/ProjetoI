import { LivroEntity } from "../model/LivroEntity"

export class LivroRepository {
    private static instance: LivroRepository
    private livroList: LivroEntity[] = []

    private constructor() {}

    public static getInstance(): LivroRepository {
        if (!this.instance) {
            this.instance = new LivroRepository()
        }
        return this.instance
    }

    inserir(livro: LivroEntity) {
        this.livroList.push(livro)
    }

    listar(): LivroEntity[] {
        return this.livroList
    }

    buscarPorISBN(isbn: string): LivroEntity | undefined {
        return this.livroList.find(l => l.isbn === isbn)
    }

    atualizar(isbn: string, titulo: string, autor: string, editora: string, edicao: string, categoria_id: number): boolean {
        const livro = this.buscarPorISBN(isbn)
        if (!livro) return false

        livro.titulo = titulo
        livro.autor = autor
        livro.editora = editora
        livro.edicao = edicao
        livro.categoria_id = categoria_id

        return true
    }

    remover(isbn: string): boolean {
        const index = this.livroList.findIndex(l => l.isbn === isbn)
        if (index >= 0) {
            this.livroList.splice(index, 1)
            return true
        }
        return false
    }
}
