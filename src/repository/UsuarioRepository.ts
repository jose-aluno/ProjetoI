import { UsuarioEntity } from "../model/UsuarioEntity"

export class UsuarioRepository {
    private static instance: UsuarioRepository
    private usuarioList: UsuarioEntity[] = []

    private constructor() {}

    public static getInstance(): UsuarioRepository {
        if (!this.instance) {
            this.instance = new UsuarioRepository()
        }
        return this.instance
    }

    inserir(usuario: UsuarioEntity) {
        this.usuarioList.push(usuario)
    }

    listar(): UsuarioEntity[] {
        return this.usuarioList
    }

    buscarPorCPF(cpf: string): UsuarioEntity | undefined {
        return this.usuarioList.find(u => u.cpf === cpf)
    }

    atualizar(cpf: string, nome: string, status: number, email: string, categoria_id: number, curso_id: number): boolean {
        const usuario = this.buscarPorCPF(cpf)
        if (!usuario) return false

        usuario.nome = nome
        usuario.status = status
        usuario.email = email
        usuario.categoria_id = categoria_id
        usuario.curso_id = curso_id

        return true
    }


    remover(cpf: string): boolean {
        const index = this.usuarioList.findIndex(u => u.cpf === cpf)
        if (index >= 0) {
            this.usuarioList.splice(index, 1)
            return true
        }
        return false
    }
}
