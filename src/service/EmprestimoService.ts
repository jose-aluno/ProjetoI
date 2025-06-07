import { EmprestimoEntity } from "../model/EmprestimoEntity"
import { EmprestimoRepository } from "../repository/EmprestimoRepository"

export class EmprestimoService {
    private emprestimoRepository = EmprestimoRepository.getInstance()

    cadastrarEmprestimo(dados: any): EmprestimoEntity {
        const {usuario_id, estoque_id, data_emprestimo, data_devolucao, data_entrega, dias_atraso, suspensao_ate} = dados

        if (usuario_id === undefined || estoque_id === undefined || !data_emprestimo || !data_devolucao || !data_entrega || dias_atraso === undefined || !suspensao_ate) {
            throw new Error("Todos os campos obrigatórios devem ser informados.")
        }

        const novoEmprestimo = new EmprestimoEntity(
            undefined,
            usuario_id,
            estoque_id,
            new Date(data_emprestimo),
            new Date(data_devolucao),
            new Date(data_entrega),
            dias_atraso,
            new Date(suspensao_ate)
        )

        this.emprestimoRepository.inserir(novoEmprestimo)
        return novoEmprestimo
    }

    listarEmprestimos(): EmprestimoEntity[] {
        return this.emprestimoRepository.listar()
    }

    buscarPorId(id: number): EmprestimoEntity | undefined {
        return this.emprestimoRepository.buscarPorId(id)
    }

    atualizarEmprestimo(id: number, dados: any): boolean {
        const {usuario_id, estoque_id, data_emprestimo, data_devolucao, data_entrega, dias_atraso, suspensao_ate} = dados

        if (usuario_id === undefined || estoque_id === undefined || !data_emprestimo || !data_devolucao || !data_entrega || dias_atraso === undefined || !suspensao_ate) {
            throw new Error("Todos os campos obrigatórios devem ser informados.")
        }

        return this.emprestimoRepository.atualizar(
            id,
            usuario_id,
            estoque_id,
            new Date(data_emprestimo),
            new Date(data_devolucao),
            new Date(data_entrega),
            dias_atraso,
            new Date(suspensao_ate)
        )
    }
}
