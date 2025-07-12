import { UsuarioEntity } from "../model/entity/UsuarioEntity"
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository"
import { CursoRepository } from "../repository/CursoRepository"
import { UsuarioRepository } from "../repository/UsuarioRepository"

export class UsuarioService {
    private usuarioRepository = UsuarioRepository.getInstance()
    private categoriaUsuarioRepository = CategoriaUsuarioRepository.getInstance()
    private cursoRepository = CursoRepository.getInstance()

    cadastrarUsuario(dados: any): UsuarioEntity {
        const { nome, cpf, email, categoria_id, curso_id } = dados;

        if (!nome || !cpf || !email || !categoria_id || !curso_id) {
            throw new Error("Todos os campos obrigatórios devem ser informados.");
        }

        const existente = this.usuarioRepository.buscarPorCPF(cpf);
        if (existente) {
            throw new Error("CPF já cadastrado.");
        }

        const categorias = this.categoriaUsuarioRepository.listar();
        let categoriaExiste = false;
        for (let i = 0; i < categorias.length; i++) {
            if (categorias[i].id === categoria_id) {
                categoriaExiste = true;
                break;
            }
        }
        if (!categoriaExiste) {
            throw new Error("Categoria de usuário inexistente.");
        }

        const cursos = this.cursoRepository.listar();
        let cursoExiste = false;
        for (let i = 0; i < cursos.length; i++) {
            if (cursos[i].id === curso_id) {
                cursoExiste = true;
                break;
            }
        }
        if (!cursoExiste) {
            throw new Error("Curso inexistente.");
        }

        const novoUsuario = new UsuarioEntity(
            undefined,
            nome,
            cpf,
            1,
            email,
            categoria_id,
            curso_id
        );

        this.usuarioRepository.inserir(novoUsuario);
        return novoUsuario;
    }

    listarUsuarios(): UsuarioEntity[] {
        return this.usuarioRepository.listar()
    }

    buscarPorCPF(cpf: string): UsuarioEntity | undefined {
        const usuarioExistente = this.usuarioRepository.buscarPorCPF(cpf);
        if (!usuarioExistente) {
            throw new Error("Usuário não encontrado.");
        }
        return usuarioExistente
    }

    atualizarUsuario(cpf: string, dados: any): boolean {
        const { nome, status, email, categoria_id, curso_id } = dados;

        if (!nome || status === undefined || !email || !categoria_id || !curso_id) {
            throw new Error("Todos os campos obrigatórios devem ser informados.");
        }

        if (status !== 0 && status !== 1 && status !== 2) {
            throw new Error("Status inválido. Valores permitidos: 0 (inativo), 1 (ativo), 2 (suspenso).");
        }

        const categorias = this.categoriaUsuarioRepository.listar();
        let categoriaExiste = false;
        for (let i = 0; i < categorias.length; i++) {
            if (categorias[i].id === categoria_id) {
                categoriaExiste = true;
                break;
            }
        }
        if (!categoriaExiste) {
            throw new Error("Categoria de usuário inexistente.");
        }

        const cursos = this.cursoRepository.listar();
        let cursoExiste = false;
        for (let i = 0; i < cursos.length; i++) {
            if (cursos[i].id === curso_id) {
                cursoExiste = true;
                break;
            }
        }
        if (!cursoExiste) {
            throw new Error("Curso inexistente.");
        }

        const usuario = this.usuarioRepository.buscarPorCPF(cpf);
        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }

        return this.usuarioRepository.atualizar(cpf, nome, status, email, categoria_id, curso_id);
    }

    removerUsuario(cpf: string): boolean {
        return this.usuarioRepository.remover(cpf)
    }
}