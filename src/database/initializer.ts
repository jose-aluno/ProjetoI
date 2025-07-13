import { CategoriaLivroRepository } from "../repository/CategoriaLivroRepository";
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository";
import { CursoRepository } from "../repository/CursoRepository";
import { LivroRepository } from "../repository/LivroRepository";
import { UsuarioRepository } from "../repository/UsuarioRepository";

const categoriaLivroRepository = CategoriaLivroRepository.getInstance()
const categoriaUsuarioRepository = CategoriaUsuarioRepository.getInstance()
const cursoRepository = CursoRepository.getInstance()
const livroRepository = LivroRepository.getInstance()
const usuarioRepository = UsuarioRepository.getInstance()

export async function inicializarTabelas(){
    await categoriaLivroRepository.init()
    await categoriaUsuarioRepository.init()
    await cursoRepository.init()
    await livroRepository.init()
    await usuarioRepository.init()
}