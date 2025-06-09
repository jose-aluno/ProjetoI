import { Request, Response } from "express";
import { LivroService } from "../service/LivroService";

export class LivroController {
  private livroService = new LivroService();

  listarLivros(req: Request, res: Response): void {
    try {
      const livros = this.livroService.listarLivros();
      res.status(200).json(livros);
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao listar livros."
      });
    }
  }

  buscarPorISBN(req: Request, res: Response): void {
    try {
      const { isbn } = req.params;
      const livro = this.livroService.buscarPorISBN(isbn);
      res.status(200).json(livro);
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao buscar livro por ISBN."
      });
    }
  }

  cadastrarLivro(req: Request, res: Response): void {
    try {
      const livro = this.livroService.cadastrarLivro(req.body);
      res.status(201).json({ message: "Livro cadastrado com sucesso!", livro });
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao cadastrar livro."
      });
    }
  }

  atualizarLivro(req: Request, res: Response): void {
    try {
      const { isbn } = req.params;
      const atualizado = this.livroService.atualizarLivro(isbn, req.body);
      res.status(200).json({ message: "Livro atualizado com sucesso!", atualizado });
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao atualizar livro."
      });
    }
  }

  removerLivro(req: Request, res: Response): void {
    try {
      const { isbn } = req.params;
      const livro = this.livroService.buscarPorISBN(isbn);
      this.livroService.removerLivro(isbn);
      res.status(200).json({ message: "Livro removido com sucesso!", livro });
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao remover livro."
      });
    }
  }
}
