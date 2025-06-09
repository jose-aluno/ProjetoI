import { Request, Response } from "express"
import { UsuarioService } from "../service/UsuarioService"

export class UsuarioController {
  private usuarioService = new UsuarioService()

  listarUsuarios(req: Request, res: Response): void {
    try {
      const usuarios = this.usuarioService.listarUsuarios()
      res.status(200).json(usuarios)
    } catch (error: unknown) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Erro ao listar usuários.",
      });
    }
  }

  buscarUsuarioPorCpf(req: Request, res: Response): void {
    try {
      const { cpf } = req.params
      const usuario = this.usuarioService.buscarPorCPF(cpf)

      if (!usuario) {
        res.status(404).json({ message: "Usuário não encontrado com o CPF informado." })
      }

      res.status(200).json(usuario)
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao buscar usuário por CPF.",
      });
    }
  }

  cadastrarUsuario(req: Request, res: Response): void {
    try {
      const usuario = this.usuarioService.cadastrarUsuario(req.body)
      res.status(201).json({
        message: "Usuário cadastrado com sucesso!",
        usuario: usuario,
      });
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao cadastrar usuário.",
      });
    }
  }

  atualizarUsuario(req: Request, res: Response): void {
    try {
      const { cpf } = req.params;
      const atualizado = this.usuarioService.atualizarUsuario(cpf, req.body)

      if (!atualizado) {
        res.status(404).json({ message: "Usuário não encontrado para atualização." });
      }

      res.status(200).json({ message: "Usuário atualizado com sucesso!" })
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao atualizar usuário.",
      });
    }
  }

  removerUsuario(req: Request, res: Response): void {
    try {
      const { cpf } = req.params;
      const removido = this.usuarioService.removerUsuario(cpf)

      if (!removido) {
        res.status(404).json({ message: "Usuário não encontrado para remoção." })
      }

      res.status(200).json({ message: "Usuário removido com sucesso!" })
    } catch (error: unknown) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao remover usuário.",
      });
    }
  }
}
