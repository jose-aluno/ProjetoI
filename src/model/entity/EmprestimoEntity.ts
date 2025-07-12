export class EmprestimoEntity {
    id: number
    usuario_cpf: string
    estoque_id: number
    data_emprestimo: Date
    data_devolucao: Date
    data_entrega: Date | null
    dias_atraso: number
    suspensao_ate: Date | null

    constructor(id: number | undefined, usuario_cpf: string, estoque_id: number, data_emprestimo: Date, data_devolucao: Date, data_entrega: Date | null, dias_atraso: number, suspensao_ate: Date | null){
        this.id = id ?? this.gerarId()
        this.usuario_cpf = usuario_cpf
        this.estoque_id = estoque_id
        this.data_emprestimo = data_emprestimo
        this.data_devolucao = data_devolucao
        this.data_entrega = data_entrega
        this.dias_atraso = dias_atraso
        this.suspensao_ate = suspensao_ate
    }

    private gerarId(): number {
        return parseInt((Date.now() /100).toString(), 10)
    }
}