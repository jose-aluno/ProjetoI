import { Request, Response } from "express";
import { CatalogoService } from "../service/CatalogoService";

export class CatalogoController {
  private catalogoService = new CatalogoService();

  listarCategoriasLivro(req: Request, res: Response): void {
    try {
      const categorias = this.catalogoService.listarCategoriasLivro();
      res.status(200).json(categorias);
    } catch (error: unknown) {
      res.status(400).json({ message: "Erro ao listar categorias de livros." });
    }
  }

  listarCategoriasUsuario(req: Request, res: Response): void {
    try {
      const categorias = this.catalogoService.listarCategoriasUsuario();
      res.status(200).json(categorias);
    } catch (error: unknown) {
      res.status(400).json({ message: "Erro ao listar categorias de usuários." });
    }
  }

  listarCursos(req: Request, res: Response): void {
    try {
      const cursos = this.catalogoService.listarCursos();
      res.status(200).json(cursos);
    } catch (error: unknown) {
      res.status(400).json({ message: "Erro ao listar cursos." });
    }
  }
}