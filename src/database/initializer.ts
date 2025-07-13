import { CategoriaLivroRepository } from "../repository/CategoriaLivroRepository";
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository";
import { CursoRepository } from "../repository/CursoRepository";

const categoriaLivroRepository = CategoriaLivroRepository.getInstance()
const categoriaUsuarioRepository = CategoriaUsuarioRepository.getInstance()
const cursoRepository = CursoRepository.getInstance()

export async function inicializarTabelas(){
    await categoriaLivroRepository.init();
    await categoriaUsuarioRepository.init();
    await cursoRepository.init();
}