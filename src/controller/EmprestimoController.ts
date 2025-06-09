import { Request, Response } from "express";
import { EmprestimoService } from "../service/EmprestimoService";

export class EmprestimoController {
  private emprestimoService = new EmprestimoService();

  listarEmprestimos(req: Request, res: Response): void {
    try {
      const emprestimos = this.emprestimoService.listarEmprestimos();
      res.status(200).json(emprestimos);
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao listar empréstimos."
      });
    }
  }

  cadastrarEmprestimo(req: Request, res: Response): void {
    try {
      const emprestimo = this.emprestimoService.cadastrarEmprestimo(req.body);
      res.status(201).json({ message: "Empréstimo registrado com sucesso!", emprestimo });
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao registrar empréstimo."
      });
    }
  }

  registrarDevolucao(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const atualizado = this.emprestimoService.atualizarEmprestimo(Number(id));
      res.status(200).json({ message: "Empréstimo atualizado com sucesso!", atualizado });
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao atualizar empréstimo."
      });
    }
  }
}
