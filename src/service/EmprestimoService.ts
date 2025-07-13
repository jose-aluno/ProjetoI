import { EmprestimoEntity } from "../model/entity/EmprestimoEntity";
import { EmprestimoRepository } from "../repository/EmprestimoRepository";
import { EstoqueRepository } from "../repository/EstoqueRepository";
import { UsuarioRepository } from "../repository/UsuarioRepository";
import { LivroRepository } from "../repository/LivroRepository";

export class EmprestimoService {
  private emprestimoRepository = EmprestimoRepository.getInstance();
  private estoqueRepository = EstoqueRepository.getInstance();
  private usuarioRepository = UsuarioRepository.getInstance();
  private livroRepository = LivroRepository.getInstance();

  async cadastrarEmprestimo(dados: any): Promise<EmprestimoEntity> {
    const { cpf, estoque_id } = dados;

    if (!cpf || estoque_id === undefined) {
      throw new Error("Campos 'cpf' e 'estoque_id' são obrigatórios.");
    }

    const usuario = await this.usuarioRepository.buscarPorCPF(cpf);
    if (!usuario) throw new Error("Usuário não encontrado.");
    if (Number(usuario.status) != 1) throw new Error("Usuário não está ativo.");

    const estoque = await this.estoqueRepository.buscarPorId(estoque_id);
    if (!estoque) throw new Error("Exemplar não encontrado.");
    if (!estoque.disponivel) throw new Error("Exemplar indisponível.");

    const livro = await this.livroRepository.buscarPorISBN(estoque.livro_isbn);
    if (!livro) throw new Error("Livro não encontrado.");

    const emprestimosUsuario = await this.emprestimoRepository.listar();
    const emprestimosAtivos = emprestimosUsuario.filter(e =>
      e.usuario_cpf === cpf && e.data_entrega === null
    );

    const limite = usuario.categoria_id === 1 ? 5 : 3;
    if (emprestimosAtivos.length >= limite) {
      throw new Error(`Usuário já atingiu o limite de empréstimos (${limite}).`);
    }

    const diasPrazo = usuario.categoria_id === 1
      ? 40
      : (usuario.curso_id === livro.categoria_id ? 30 : 15);

    const data_emprestimo = new Date();
    const data_devolucao = new Date();
    data_devolucao.setDate(data_emprestimo.getDate() + diasPrazo);

    const emprestimo = new EmprestimoEntity(
      undefined,
      cpf,
      estoque_id,
      data_emprestimo,
      data_devolucao,
      null,
      0,
      null
    );

    await this.estoqueRepository.atualizarQuantidade(
      estoque_id,
      estoque.quantidade,
      estoque.quantidade_emprestada + 1
    );

    await this.emprestimoRepository.inserir(emprestimo);
    return emprestimo;
  }

  async atualizarEmprestimo(id: number): Promise<boolean> {
    const emprestimo = await this.emprestimoRepository.buscarPorId(id);
    if (!emprestimo) throw new Error("Empréstimo não encontrado.");
    if (emprestimo.data_entrega) throw new Error("Este empréstimo já foi devolvido.");

    const hoje = new Date();
    const atraso = Math.max(
      0,
      Math.ceil((hoje.getTime() - emprestimo.data_devolucao.getTime()) / (1000 * 60 * 60 * 24))
    );

    const suspensao_ate = atraso > 0 ? new Date(hoje.getTime() + atraso * 3 * 24 * 60 * 60 * 1000) : null;

    const sucesso = await this.emprestimoRepository.atualizar(
      id,
      emprestimo.usuario_cpf,
      emprestimo.estoque_id,
      emprestimo.data_emprestimo,
      emprestimo.data_devolucao,
      hoje,
      atraso,
      suspensao_ate
    );

    const estoque = await this.estoqueRepository.buscarPorId(emprestimo.estoque_id);
    if (estoque) {
      await this.estoqueRepository.atualizarQuantidade(
        emprestimo.estoque_id,
        estoque.quantidade,
        estoque.quantidade_emprestada - 1
      );
    }

    if (atraso > 0) {
      const usuario = await this.usuarioRepository.buscarPorCPF(emprestimo.usuario_cpf);
      if (usuario) {
        const emprestimosAtrasados = await this.emprestimoRepository.contarEmprestimosAtrasados(emprestimo.usuario_cpf);
        
        if (emprestimosAtrasados >= 2) {
          await this.usuarioRepository.atualizar(
            usuario.cpf,
            usuario.nome,
            0, // Inativo
            usuario.email,
            usuario.categoria_id,
            usuario.curso_id
          );
        } else {
          await this.usuarioRepository.atualizar(
            usuario.cpf,
            usuario.nome,
            2, // Suspenso
            usuario.email,
            usuario.categoria_id,
            usuario.curso_id
          );
        }
      }
    }

    return sucesso;
  }

  async listarEmprestimos(): Promise<EmprestimoEntity[]> {
    return await this.emprestimoRepository.listar();
  }

  async buscarPorId(id: number): Promise<EmprestimoEntity | undefined> {
    return await this.emprestimoRepository.buscarPorId(id);
  }

  async verificarSuspensoesEmLotes(batchSize = 1000): Promise<void> {
    let offset = 0;
    let lote: EmprestimoEntity[];

    const hoje = new Date();
    const usuariosProcessados = new Set<string>();

    do {
      lote = await this.emprestimoRepository.buscarAtrasadosNaoDevolvidos(batchSize, offset);
      
      for (const emprestimo of lote) {
        if (usuariosProcessados.has(emprestimo.usuario_cpf)) continue;

        const atrasoDias = Math.ceil((hoje.getTime() - emprestimo.data_devolucao.getTime()) / (1000 * 60 * 60 * 24));
        const suspensao_ate = new Date(hoje.getTime() + atrasoDias * 3 * 24 * 60 * 60 * 1000);

        await this.emprestimoRepository.atualizar(
          emprestimo.id!,
          emprestimo.usuario_cpf,
          emprestimo.estoque_id,
          emprestimo.data_emprestimo,
          emprestimo.data_devolucao,
          emprestimo.data_entrega,
          atrasoDias,
          suspensao_ate
        );

        const usuario = await this.usuarioRepository.buscarPorCPF(emprestimo.usuario_cpf);
        if (usuario) {
          const emprestimosAtrasados = await this.emprestimoRepository.contarEmprestimosAtrasados(emprestimo.usuario_cpf);
          
          let novoStatus = 1; // Ativo
          if (emprestimosAtrasados >= 2) {
            novoStatus = 0; // Inativo
          } else if (emprestimosAtrasados === 1) {
            novoStatus = 2; // Suspenso
          }

          await this.usuarioRepository.atualizar(
            usuario.cpf,
            usuario.nome,
            novoStatus,
            usuario.email,
            usuario.categoria_id,
            usuario.curso_id
          );
          
          usuariosProcessados.add(usuario.cpf);
        }
      }

      offset += batchSize;
    } while (lote.length === batchSize);
  }

  async verificarStatusSuspensaoUsuario(cpf: string): Promise<void> {
    const usuario = await this.usuarioRepository.buscarPorCPF(cpf);
    if (!usuario) return;

    const emprestimosAtrasados = await this.emprestimoRepository.contarEmprestimosAtrasados(cpf);
    
    let novoStatus = 1; // Ativo
    if (emprestimosAtrasados >= 2) {
      novoStatus = 0; // Inativo
    } else if (emprestimosAtrasados === 1) {
      novoStatus = 2; // Suspenso
    }

    await this.usuarioRepository.atualizar(
      usuario.cpf,
      usuario.nome,
      novoStatus,
      usuario.email,
      usuario.categoria_id,
      usuario.curso_id
    );
  }
}