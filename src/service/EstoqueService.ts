import { EstoqueEntity } from "../model/entity/EstoqueEntity";
import { EstoqueRepository } from "../repository/EstoqueRepository";
import { LivroRepository } from "../repository/LivroRepository";

export class EstoqueService {
  private estoqueRepository = EstoqueRepository.getInstance();
  private livroRepository = LivroRepository.getInstance();

  async cadastrar(dados: any): Promise<EstoqueEntity> {
    const { livro_isbn, quantidade } = dados;

    if (!livro_isbn || quantidade === undefined) {
      throw new Error("Campos 'livro_isbn' e 'quantidade' são obrigatórios.");
    }

    const livroExiste = await this.livroRepository.buscarPorISBN(livro_isbn);
    if (!livroExiste) {
      throw new Error("Livro com o ISBN informado não existe.");
    }

    const novoEstoque = new EstoqueEntity(undefined, livro_isbn, quantidade, 0);
    await this.estoqueRepository.inserir(novoEstoque);
    return novoEstoque;
  }

  async listarTodos(): Promise<EstoqueEntity[]> {
    return await this.estoqueRepository.listar();
  }

  async buscarPorISBN(isbn: string): Promise<EstoqueEntity[]> {
    const estoques = await this.estoqueRepository.listar();
    const filtrados = estoques.filter(e => e.livro_isbn === isbn);

    if (filtrados.length === 0) {
      throw new Error("Nenhum exemplar encontrado para o ISBN informado.");
    }

    return filtrados;
  }

  async buscarPorId(id: number): Promise<EstoqueEntity | undefined> {
    return await this.estoqueRepository.buscarPorId(id);
  }

  async listarDisponiveis(): Promise<EstoqueEntity[]> {
    return await this.estoqueRepository.listarDisponiveis();
  }

  async registrarDevolucao(id: number): Promise<EstoqueEntity> {
    const estoque = await this.estoqueRepository.buscarPorId(id);

    if (!estoque) {
      throw new Error("Exemplar não encontrado.");
    }

    if (estoque.quantidade_emprestada <= 0) {
      throw new Error("Nenhum exemplar emprestado para devolução.");
    }

    // Usar o método do repositório para atualizar
    const sucesso = await this.estoqueRepository.atualizarQuantidade(
      id,
      estoque.quantidade,
      estoque.quantidade_emprestada - 1
    );

    if (!sucesso) {
      throw new Error("Erro ao registrar devolução.");
    }

    // Retornar o estoque atualizado
    const estoqueAtualizado = await this.estoqueRepository.buscarPorId(id);
    return estoqueAtualizado!;
  }

  async atualizar(id: number, dados: any): Promise<boolean> {
    const { livro_isbn, quantidade, quantidade_emprestada } = dados;

    if (!livro_isbn || quantidade === undefined || quantidade_emprestada === undefined) {
      throw new Error("Campos 'livro_isbn', 'quantidade' e 'quantidade_emprestada' são obrigatórios.");
    }

    const estoque = await this.estoqueRepository.buscarPorId(id);
    if (!estoque) {
      throw new Error("Exemplar não encontrado.");
    }

    // Verificar se o livro existe (se o ISBN está sendo alterado)
    if (livro_isbn !== estoque.livro_isbn) {
      const livroExiste = await this.livroRepository.buscarPorISBN(livro_isbn);
      if (!livroExiste) {
        throw new Error("Livro com o ISBN informado não existe.");
      }
    }

    // Criar instância temporária para calcular disponibilidade
    const estoqueTemp = new EstoqueEntity(id, livro_isbn, quantidade, quantidade_emprestada);
    
    return await this.estoqueRepository.atualizar(
      id,
      livro_isbn,
      quantidade,
      quantidade_emprestada,
      estoqueTemp.calcularDisponibilidade()
    );
  }

  async remover(id: number): Promise<boolean> {
    const estoque = await this.estoqueRepository.buscarPorId(id);

    if (!estoque) {
      throw new Error("Exemplar não encontrado.");
    }

    if (estoque.quantidade_emprestada > 0) {
      throw new Error("Não é possível remover um exemplar que está emprestado.");
    }

    return await this.estoqueRepository.remover(id);
  }

  async adicionarQuantidade(id: number, quantidadeAdicional: number): Promise<boolean> {
    if (quantidadeAdicional <= 0) {
      throw new Error("Quantidade adicional deve ser maior que zero.");
    }

    const estoque = await this.estoqueRepository.buscarPorId(id);
    if (!estoque) {
      throw new Error("Exemplar não encontrado.");
    }

    const novaQuantidade = estoque.quantidade + quantidadeAdicional;
    
    return await this.estoqueRepository.atualizarQuantidade(
      id,
      novaQuantidade,
      estoque.quantidade_emprestada
    );
  }

  async verificarDisponibilidade(id: number): Promise<{ disponivel: boolean, quantidadeDisponivel: number }> {
    const estoque = await this.estoqueRepository.buscarPorId(id);
    
    if (!estoque) {
      throw new Error("Exemplar não encontrado.");
    }

    const quantidadeDisponivel = estoque.quantidade - estoque.quantidade_emprestada;
    
    return {
      disponivel: estoque.disponivel,
      quantidadeDisponivel: quantidadeDisponivel
    };
  }
}