import { Request, Response } from "express";
import { EstoqueService } from "../service/EstoqueService";

export class EstoqueController {
  private estoqueService = new EstoqueService();

  listarEstoque(req: Request, res: Response): void {
    try {
      const estoques = this.estoqueService.listarTodos();
      res.status(200).json(estoques);
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao listar estoque."
      });
    }
  }

  buscarPorISBN(req: Request, res: Response): void {
    try {
      const { isbn } = req.params;
      const lista = this.estoqueService.buscarPorISBN(isbn);
      res.status(200).json(lista);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  cadastrarExemplar(req: Request, res: Response): void {
    try {
      const estoque = this.estoqueService.cadastrar(req.body);
      res.status(201).json({ message: "Exemplar cadastrado com sucesso!", estoque });
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao cadastrar exemplar."
      });
    }
  }

  registrarDevolucao(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const atualizado = this.estoqueService.registrarDevolucao(Number(id));
      res.status(200).json({ message: "Devolução registrada com sucesso!", atualizado });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  removerExemplar(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      this.estoqueService.remover(Number(id));
      res.status(200).json({ message: "Exemplar removido com sucesso!" });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
