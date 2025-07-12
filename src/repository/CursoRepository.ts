import { CursoEntity } from "../model/entity/CursoEntity";

export class CursoRepository {
    private static instance: CursoRepository
    private cursoList: CursoEntity[] = [
        new CursoEntity(2, 'ADS'),
        new CursoEntity(3, 'Pedagogia'),
        new CursoEntity(4, 'Administração')
    ];

    private constructor() {}

    public static getInstance(): CursoRepository {
        if (!this.instance) {
            this.instance = new CursoRepository()
        }
        return this.instance;
    }

    listar(): CursoEntity[] {
        return this.cursoList
    }
}
