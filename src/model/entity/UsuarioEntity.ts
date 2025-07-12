
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
        this.cpf = this.validarEDefinirCPF(cpf)
        this.status = status
        this.email = email
        this.categoria_id = categoria_id
        this.curso_id = curso_id
    }

    private gerarId(): number {
        return parseInt((Date.now() /100).toString(), 10)
    }

    private validarEDefinirCPF(cpf: string): string {
        if (!this.validarCPF(cpf)) {
            throw new Error("CPF inválido.");
        }
        return cpf;
    }

    private validarCPF(cpf: string): boolean {
        if (!/^\d{11}$/.test(cpf)) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        const calcDV = (cpf: string, pesoInicial: number): number => {
            let soma = 0;
            for (let i = 0; i < pesoInicial - 1; i++) {
                soma += parseInt(cpf[i]) * (pesoInicial - i);
            }
            const resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        const dv1 = calcDV(cpf, 10);
        const dv2 = calcDV(cpf, 11);

        return dv1 === parseInt(cpf[9]) && dv2 === parseInt(cpf[10]);
    }
}