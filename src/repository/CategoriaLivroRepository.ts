import { CategoriaLivroEntity } from "../model/CategoriaLivroEntity";

export class CategoriaLivroRepository {
    private static instance: CategoriaLivroRepository
    private categoriaList: CategoriaLivroEntity[] = [
        new CategoriaLivroEntity(1, 'Romance'),
        new CategoriaLivroEntity(2, 'Computação'),
        new CategoriaLivroEntity(3, 'Letras'),
        new CategoriaLivroEntity(4, 'Gestão')
    ];

    private constructor() {}

    public static getInstance(): CategoriaLivroRepository {
        if (!this.instance) {
            this.instance = new CategoriaLivroRepository()
        }
        return this.instance
    }

    listar(): CategoriaLivroEntity[] {
        return this.categoriaList
    }
}
