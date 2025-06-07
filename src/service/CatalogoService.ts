import { CategoriaLivroRepository } from "../repository/CategoriaLivroRepository"
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository"
import { CursoRepository } from "../repository/CursoRepository"

export class CatalogoService {
    private categoriaLivroRepo = CategoriaLivroRepository.getInstance()
    private categoriaUsuarioRepo = CategoriaUsuarioRepository.getInstance()
    private cursoRepo = CursoRepository.getInstance()

    listarCategoriasLivro() {
        return this.categoriaLivroRepo.listar()
    }

    listarCategoriasUsuario() {
        return this.categoriaUsuarioRepo.listar()
    }

    listarCursos() {
        return this.cursoRepo.listar()
    }
}
