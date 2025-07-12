export class CadastrarUsuarioDTO {
    public nome: string;
    public cpf: string;
    public email: string;
    public categoria_id: number; 
    public curso_id: number;

    constructor(
        nome: string,
        cpf: string,
        email: string,
        categoria_id: number,
        curso_id: number
    ) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.categoria_id = categoria_id;
        this.curso_id = curso_id;
    }
}

export class AtualizarUsuarioDTO {
    public id: number;
    public nome: string;
    public cpf: string;
    public status: number;
    public email: string;
    public categoria_id: number;
    public curso_id: number;

    constructor(
        id: number,
        nome: string,
        cpf: string,
        status: number,
        email: string,
        categoria_id: number,
        curso_id: number
    ) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.status = status;
        this.email = email;
        this.categoria_id = categoria_id;
        this.curso_id = curso_id;
    }
}