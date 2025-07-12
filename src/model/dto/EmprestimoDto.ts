export class CadastrarEmprestimoDTO {
    public cpf: string;
    public estoque_id: number;

    constructor(
        cpf: string,
        estoque_id: number
    ) {
        this.cpf = cpf;
        this.estoque_id = estoque_id;
    }
}