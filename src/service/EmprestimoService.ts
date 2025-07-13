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

  cadastrarEmprestimo(dados: any): EmprestimoEntity {
    const { cpf, estoque_id } = dados;

    if (!cpf || estoque_id === undefined) {
      throw new Error("Campos 'cpf' e 'estoque_id' são obrigatórios.");
    }

    const usuario = this.usuarioRepository.buscarPorCPF(cpf);
    if (!usuario) throw new Error("Usuário não encontrado.");
    if (usuario.status !== 1) throw new Error("Usuário não está ativo.");

    const estoque = this.estoqueRepository.buscarPorId(estoque_id);
    if (!estoque) throw new Error("Exemplar não encontrado.");
    if (!estoque.disponivel) throw new Error("Exemplar indisponível.");

    const livro = this.livroRepository.buscarPorISBN(estoque.livro_isbn);
    if (!livro) throw new Error("Livro não encontrado.");

    const emprestimosUsuario = this.emprestimoRepository.listar().filter(e =>
      e.usuario_cpf === cpf && e.data_entrega === null
    );

    const limite = usuario.categoria_id === 1 ? 5 : 3;
    if (emprestimosUsuario.length >= limite) {
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

    estoque.quantidade_emprestada++;
    estoque.disponivel = estoque.quantidade > estoque.quantidade_emprestada;

    this.emprestimoRepository.inserir(emprestimo);
    return emprestimo;
  }

  atualizarEmprestimo(id: number): boolean {
    const emprestimo = this.emprestimoRepository.buscarPorId(id);
    if (!emprestimo) throw new Error("Empréstimo não encontrado.");
    if (emprestimo.data_entrega) throw new Error("Este empréstimo já foi devolvido.");

    const hoje = new Date();
    const atraso = Math.max(
      0,
      Math.ceil((hoje.getTime() - emprestimo.data_devolucao.getTime()) / (1000 * 60 * 60 * 24))
    );

    const suspensao_ate = atraso > 0 ? new Date(hoje.getTime() + atraso * 3 * 24 * 60 * 60 * 1000) : null;

    emprestimo.data_entrega = hoje;
    emprestimo.dias_atraso = atraso;
    emprestimo.suspensao_ate = suspensao_ate;

    const estoque = this.estoqueRepository.buscarPorId(emprestimo.estoque_id);
    if (estoque) {
      estoque.quantidade_emprestada--;
      estoque.disponivel = estoque.quantidade > estoque.quantidade_emprestada;
    }

    if (atraso > 0) {
      const usuario = this.usuarioRepository.buscarPorCPF(emprestimo.usuario_cpf);
      if (usuario) {
        const emprestimosAtrasados = this.emprestimoRepository.contarEmprestimosAtrasados(emprestimo.usuario_cpf);
        
        if (emprestimosAtrasados >= 2) {
          usuario.status = 0; 
        } else {
          usuario.status = 2;
        }
      }
    }

    return true;
  }

  listarEmprestimos(): EmprestimoEntity[] {
    return this.emprestimoRepository.listar();
  }

  buscarPorId(id: number): EmprestimoEntity | undefined {
    return this.emprestimoRepository.buscarPorId(id);
  }

  async verificarSuspensoesEmLotes(batchSize = 1000): Promise<void> {
    let offset = 0;
    let lote: EmprestimoEntity[];

    const hoje = new Date();
    const usuariosProcessados = new Set<string>();

    do {
      lote = this.emprestimoRepository.buscarAtrasadosNaoDevolvidos(batchSize, offset);
      
      for (const emprestimo of lote) {
        if (usuariosProcessados.has(emprestimo.usuario_cpf)) continue;

        const atrasoDias = Math.ceil((hoje.getTime() - emprestimo.data_devolucao.getTime()) / (1000 * 60 * 60 * 24));
        const suspensao_ate = new Date(hoje.getTime() + atrasoDias * 3 * 24 * 60 * 60 * 1000);

        emprestimo.dias_atraso = atrasoDias;
        emprestimo.suspensao_ate = suspensao_ate;

        const usuario = this.usuarioRepository.buscarPorCPF(emprestimo.usuario_cpf);
        if (usuario) {
          const emprestimosAtrasados = this.emprestimoRepository.contarEmprestimosAtrasados(emprestimo.usuario_cpf);
          
          if (emprestimosAtrasados >= 2) {
            usuario.status = 0; 
          } else {
            usuario.status = 2;
          }
          
          usuariosProcessados.add(usuario.cpf);
        }
      }

      offset += batchSize;
    } while (lote.length === batchSize);
  }

  verificarStatusSuspensaoUsuario(cpf: string): void {
    const usuario = this.usuarioRepository.buscarPorCPF(cpf);
    if (!usuario) return;

    const emprestimosAtrasados = this.emprestimoRepository.contarEmprestimosAtrasados(cpf);
    
    if (emprestimosAtrasados >= 2) {
      usuario.status = 0; // Inativo
    } else if (emprestimosAtrasados === 1) {
      usuario.status = 2; // Suspenso
    } else {
      usuario.status = 1; // Ativo (sem atrasos)
    }
  }
}