import { CategoriaUsuarioEntity } from "../model/entity/CategoriaUsuarioEntity";


export class CategoriaUsuarioRepository {
    private static instance: CategoriaUsuarioRepository
    private categoriaList: CategoriaUsuarioEntity[] = [
        new CategoriaUsuarioEntity(1, 'Professor'),
        new CategoriaUsuarioEntity(2, 'Aluno'),
        new CategoriaUsuarioEntity(3, 'Bibliotecário')
    ];

    private constructor() {}

    public static getInstance(): CategoriaUsuarioRepository {
        if (!this.instance) {
            this.instance = new CategoriaUsuarioRepository()
        }
        return this.instance
    }

    listar(): CategoriaUsuarioEntity[] {
        return this.categoriaList
    }
}
