export class UsuarioEntity {
    id: number
    nome: string
    cpf: string
    status: number // 0 = inativo, 1 = ativo, 2 = suspenso
    email: string
    categoria_id: number
    curso_id: number

    constructor (id: number | undefined, nome: string, cpf: string, status: number, email: string, categoria_id: number, curso_id: number)
    {
        this.id = id ?? this.gerarId()
        this.nome = nome
        this.cpf = cpf
        this.status = status
        this.email = email
        this.categoria_id = categoria_id
        this.curso_id = curso_id
    }

    private gerarId(): number {
        return parseInt((Date.now() /100).toString(), 10)
    }
}