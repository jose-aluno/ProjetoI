import { CursoEntity } from "../model/CursoEntity";

export class CursoRepository {
    private static instance: CursoRepository
    private cursoList: CursoEntity[] = [
        new CursoEntity(1, 'ADS'),
        new CursoEntity(2, 'Pedagogia'),
        new CursoEntity(3, 'Administração')
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
