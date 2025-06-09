import { Request, Response } from "express";
import { EstoqueService } from "../service/EstoqueService";

export class EstoqueController {
  private estoqueService = new EstoqueService();

  listarEstoque(req: Request, res: Response): void {
    try {
      const estoques = this.estoqueService.listarEstoques();
      res.status(200).json(estoques);
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao listar estoque."
      });
    }
  }

  buscarExemplarPorId(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const estoque = this.estoqueService.buscarPorId(Number(id));
      res.status(200).json(estoque);
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao buscar exemplar."
      });
    }
  }

  cadastrarExemplar(req: Request, res: Response): void {
    try {
      const estoque = this.estoqueService.cadastrarEstoque(req.body);
      res.status(201).json({ message: "Exemplar cadastrado com sucesso!", estoque });
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao cadastrar exemplar."
      });
    }
  }

  atualizarEstoque(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const atualizado = this.estoqueService.atualizarEstoque(Number(id), req.body);
      res.status(200).json({ message: "Estoque atualizado com sucesso!", atualizado });
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao atualizar estoque."
      });
    }
  }

  removerExemplar(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const estoque = this.estoqueService.buscarPorId(Number(id));
      this.estoqueService.removerEstoque(Number(id));
      res.status(200).json({ message: "Exemplar removido com sucesso!", estoque });
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao remover exemplar."
      });
    }
  }
}
