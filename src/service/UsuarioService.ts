import { UsuarioEntity } from "../model/UsuarioEntity"
import { UsuarioRepository } from "../repository/UsuarioRepository"

export class UsuarioService {
    private usuarioRepository = UsuarioRepository.getInstance()

    cadastrarUsuario(dados: any): UsuarioEntity {
        const { nome, cpf, email, categoria_id, curso_id } = dados

        if (!nome || !cpf || !email || !categoria_id || !curso_id) {
            throw new Error("Todos os campos obrigatórios devem ser informados.")
        }

        const existente = this.usuarioRepository.buscarPorCPF(cpf)
        if (existente) {
            throw new Error("CPF já cadastrado.")
        }

        const novoUsuario = new UsuarioEntity(
            undefined,
            nome,
            cpf,
            1, //status inicial ativo
            email,
            categoria_id,
            curso_id
        )

        this.usuarioRepository.inserir(novoUsuario)
        return novoUsuario
    }

    listarUsuarios(): UsuarioEntity[] {
        return this.usuarioRepository.listar()
    }

    buscarPorCPF(cpf: string): UsuarioEntity | undefined {
        return this.usuarioRepository.buscarPorCPF(cpf)
    }

    atualizarUsuario(cpf: string, dados: any): boolean {
        const { nome, status, email, categoria_id, curso_id } = dados

        if (!nome || status === undefined || !email || !categoria_id || !curso_id) {
            throw new Error("Todos os campos obrigatórios devem ser informados.")
        }

        return this.usuarioRepository.atualizar(cpf, nome, status, email, categoria_id, curso_id)
    }

    removerUsuario(cpf: string): boolean {
        return this.usuarioRepository.remover(cpf)
    }
}
