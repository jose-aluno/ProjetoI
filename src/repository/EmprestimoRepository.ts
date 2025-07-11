import { EmprestimoEntity } from "../model/EmprestimoEntity"

export class EmprestimoRepository {
    private static instance: EmprestimoRepository
    private emprestimoList: EmprestimoEntity[] = []

    private constructor() {}

    public static getInstance(): EmprestimoRepository {
        if (!this.instance) {
            this.instance = new EmprestimoRepository()
        }
        return this.instance
    }

    inserir(emprestimo: EmprestimoEntity) {
        this.emprestimoList.push(emprestimo)
    }

    listar(): EmprestimoEntity[] {
        return this.emprestimoList
    }

    buscarPorId(id: number): EmprestimoEntity | undefined {
        return this.emprestimoList.find(e => e.id === id)
    }

    atualizar(id: number, usuario_cpf: string, estoque_id: number, data_emprestimo: Date, data_devolucao: Date, data_entrega: Date, dias_atraso: number, suspensao_ate: Date): boolean {
        const emprestimo = this.buscarPorId(id)
        if (!emprestimo) return false

        emprestimo.usuario_cpf = usuario_cpf
        emprestimo.estoque_id = estoque_id
        emprestimo.data_emprestimo = data_emprestimo
        emprestimo.data_devolucao = data_devolucao
        emprestimo.data_entrega = data_entrega
        emprestimo.dias_atraso = dias_atraso
        emprestimo.suspensao_ate = suspensao_ate

        return true
    }

    buscarAtrasadosNaoDevolvidos(limit: number, offset: number): EmprestimoEntity[] {
    const hoje = new Date();
    return this.emprestimoList
        .filter(e =>
        e.data_entrega === null &&
        e.data_devolucao < hoje &&
        !e.suspensao_ate
        )
        .slice(offset, offset + limit);
    }

}
