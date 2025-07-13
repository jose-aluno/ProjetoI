import { CategoriaLivroRepository } from "../repository/CategoriaLivroRepository";

const categoriaLivroRepository = CategoriaLivroRepository.getInstance()

export async function inicializarTabelas(){
    await categoriaLivroRepository.init();
}