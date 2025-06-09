import { EstoqueEntity } from "../model/EstoqueEntity";
import { EstoqueRepository } from "../repository/EstoqueRepository";
import { LivroRepository } from "../repository/LivroRepository";

export class EstoqueService {
  private estoqueRepository = EstoqueRepository.getInstance();
  private livroRepository = LivroRepository.getInstance();

  cadastrar(dados: any): EstoqueEntity {
    const { livro_isbn, quantidade } = dados;

    if (!livro_isbn || quantidade === undefined) {
      throw new Error("Campos 'livro_isbn' e 'quantidade' são obrigatórios.");
    }

    const livroExiste = this.livroRepository.buscarPorISBN(livro_isbn);
    if (!livroExiste) {
      throw new Error("Livro com o ISBN informado não existe.");
    }

    const novoEstoque = new EstoqueEntity(undefined, livro_isbn, quantidade, 0);
    this.estoqueRepository.inserir(novoEstoque);
    return novoEstoque;
  }

  listarTodos(): EstoqueEntity[] {
    return this.estoqueRepository.listar();
  }

  buscarPorISBN(isbn: string): EstoqueEntity[] {
    const estoques = this.estoqueRepository.listar();
    const filtrados = estoques.filter(e => e.livro_isbn === isbn);

    if (filtrados.length === 0) {
      throw new Error("Nenhum exemplar encontrado para o ISBN informado.");
    }

    return filtrados;
  }

  registrarDevolucao(id: number): EstoqueEntity {
    const estoque = this.estoqueRepository.buscarPorId(id);

    if (!estoque) {
      throw new Error("Exemplar não encontrado.");
    }

    if (estoque.quantidade_emprestada <= 0) {
      throw new Error("Nenhum exemplar emprestado para devolução.");
    }

    estoque.quantidade_emprestada -= 1;
    estoque.disponivel = estoque.calcularDisponibilidade();
    return estoque;
  }

  remover(id: number): boolean {
    const estoque = this.estoqueRepository.buscarPorId(id);

    if (!estoque) {
      throw new Error("Exemplar não encontrado.");
    }

    if (estoque.quantidade_emprestada > 0) {
      throw new Error("Não é possível remover um exemplar que está emprestado.");
    }

    return this.estoqueRepository.remover(id);
  }
}
