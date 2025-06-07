import { LivroEntity } from "../model/LivroEntity"
import { LivroRepository } from "../repository/LivroRepository"

export class LivroService {
    private livroRepository = LivroRepository.getInstance()

    cadastrarLivro(dados: any): LivroEntity {
        const { titulo, isbn, autor, editora, edicao, categoria_id } = dados

        if (!titulo || !isbn || !autor || !editora || !edicao || !categoria_id) {
            throw new Error("Todos os campos obrigatórios devem ser informados.")
        }

        const existente = this.livroRepository.buscarPorISBN(isbn)
        if (existente) {
            throw new Error("Livro com este ISBN já está cadastrado.")
        }

        const novoLivro = new LivroEntity(
            undefined,
            titulo,
            isbn,
            autor,
            editora,
            edicao,
            categoria_id
        )

        this.livroRepository.inserir(novoLivro)
        return novoLivro
    }

    listarLivros(): LivroEntity[] {
        return this.livroRepository.listar()
    }

    buscarPorISBN(isbn: string): LivroEntity | undefined {
        return this.livroRepository.buscarPorISBN(isbn)
    }

    atualizarLivro(isbn: string, dados: any): boolean {
        const { titulo, autor, editora, edicao, categoria_id } = dados

        if (!titulo || !autor || !editora || !edicao || !categoria_id) {
            throw new Error("Todos os campos obrigatórios devem ser informados.")
        }

        return this.livroRepository.atualizar(isbn, titulo, autor, editora, edicao, categoria_id)
    }

    removerLivro(isbn: string): boolean {
        return this.livroRepository.remover(isbn)
    }
}
