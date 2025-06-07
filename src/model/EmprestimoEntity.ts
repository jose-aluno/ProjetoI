export class EmprestimoEntity {
    id: number
    usuario_id: number
    estoque_id: number
    data_emprestimo: Date
    data_devolucao: Date
    data_entrega: Date
    dias_atraso: number
    suspensao_ate: Date

    constructor(id: number | undefined, usuario_id: number, estoque_id: number, data_emprestimo: Date, data_devolucao: Date, data_entrega: Date, dias_atraso: number, suspensao_ate: Date){
        this.id = id ?? this.gerarId()
        this.usuario_id = usuario_id
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