import { LivroEntity } from "../model/entity/LivroEntity"
import { CategoriaLivroRepository } from "../repository/CategoriaLivroRepository"
import { LivroRepository } from "../repository/LivroRepository"

export class LivroService {
    private livroRepository = LivroRepository.getInstance()
    private categoriaLivroRepository = CategoriaLivroRepository.getInstance()

    async cadastrarLivro(dados: any): Promise<LivroEntity> {
        const { titulo, isbn, autor, editora, edicao, categoria_id } = dados

        if (!titulo || !isbn || !autor || !editora || !edicao || !categoria_id) {
            throw new Error("Todos os campos obrigatórios devem ser informados.")
        }

        const existente = await this.livroRepository.buscarPorISBN(isbn)
        if (existente) {
            throw new Error("Livro com este ISBN já está cadastrado.")
        }

        const categorias = await this.categoriaLivroRepository.listar()
        let categoriaEncontrada = false
        for (let i = 0; i < categorias.length; i++) {
            if (categorias[i].id === categoria_id) {
                categoriaEncontrada = true
                break
            }
        }
        if (!categoriaEncontrada) {
            throw new Error("Categoria de livro inexistente.")
        }

        const livros = await this.livroRepository.listar()
        for (let i = 0; i < livros.length; i++) {
            const livro = livros[i]
            if (
                livro.autor === autor &&
                livro.editora === editora &&
                livro.edicao === edicao
            ) {
                throw new Error("Já existe um livro com a mesma combinação de autor, editora e edição.")
            }
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

    async listarLivros(): Promise<LivroEntity[]> {
        return await this.livroRepository.listar()
    }

    async buscarPorISBN(isbn: string): Promise<LivroEntity | undefined> {
        return await this.livroRepository.buscarPorISBN(isbn)
    }

    async atualizarLivro(isbn: string, dados: any): Promise<boolean> {
        const { titulo, autor, editora, edicao, categoria_id } = dados

        if (!titulo || !autor || !editora || !edicao || !categoria_id) {
            throw new Error("Todos os campos obrigatórios devem ser informados.")
        }

        const livroExistente = await this.livroRepository.buscarPorISBN(isbn)
        if (!livroExistente) {
            throw new Error("Livro não encontrado para atualização.")
        }

        const categorias = await this.categoriaLivroRepository.listar()
        let categoriaValida = false
        for (let i = 0; i < categorias.length; i++) {
            if (categorias[i].id === categoria_id) {
                categoriaValida = true
                break
            }
        }
        if (!categoriaValida) {
            throw new Error("Categoria de livro inexistente.")
        }

        const livros = await this.livroRepository.listar()
        for (let i = 0; i < livros.length; i++) {
            const livro = livros[i]
            if (
                livro.isbn !== isbn &&
                livro.autor === autor &&
                livro.editora === editora &&
                livro.edicao === edicao
            ) {
                throw new Error("Outro livro com a mesma combinação de autor, editora e edição já está cadastrado.")
            }
        }

        return await this.livroRepository.atualizar(isbn, titulo, autor, editora, edicao, categoria_id)
    }

    async removerLivro(isbn: string): Promise<boolean> {
        return await this.livroRepository.remover(isbn)
    }
}