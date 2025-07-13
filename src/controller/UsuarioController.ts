import { Body, Controller, Delete, Get, Path, Post, Put, Query, Res, Route, Tags, TsoaResponse } from "tsoa";
import { UsuarioService } from "../service/UsuarioService";
import { BasicResponseDto } from "../model/dto/BasicResponseDto";
import { CadastrarUsuarioDTO, AtualizarUsuarioDTO } from "../model/dto/UsuarioDto";

@Route("usuarios")
@Tags("usuarios")
export class UsuarioController extends Controller {
  private usuarioService = new UsuarioService();

  @Get()
  async listarUsuarios(
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() serverError: TsoaResponse<500, BasicResponseDto>
  ) {
    try {
      const usuarios = await this.usuarioService.listarUsuarios();
      return success(200, new BasicResponseDto("Usuários listados com sucesso!", usuarios));
    } catch (error: any) {
      return serverError(500, new BasicResponseDto(error.message, undefined));
    }
  }

  @Get("{cpf}")
  async buscarUsuarioPorCpf(
    @Path() cpf: string,
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() notFound: TsoaResponse<404, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const usuario = await this.usuarioService.buscarPorCPF(cpf);
      if (!usuario) {
        return notFound(404, new BasicResponseDto("Usuário não encontrado com o CPF informado.", undefined));
      }
      return success(200, new BasicResponseDto("Usuário encontrado com sucesso!", usuario));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }

  @Post()
  async cadastrarUsuario(
    @Body() body: CadastrarUsuarioDTO,
    @Res() created: TsoaResponse<201, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const usuario = await this.usuarioService.cadastrarUsuario(body);
      return created(201, new BasicResponseDto("Usuário cadastrado com sucesso!", usuario));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }

  @Put("{cpf}")
  async atualizarUsuario(
    @Path() cpf: string,
    @Body() body: AtualizarUsuarioDTO,
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() notFound: TsoaResponse<404, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const atualizado = await this.usuarioService.atualizarUsuario(cpf, body);
      if (!atualizado) {
        return notFound(404, new BasicResponseDto("Usuário não encontrado para atualização.", undefined));
      }
      return success(200, new BasicResponseDto("Usuário atualizado com sucesso!", atualizado));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }

  @Delete("{cpf}")
  async removerUsuario(
    @Path() cpf: string,
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() notFound: TsoaResponse<404, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const removido = await this.usuarioService.removerUsuario(cpf);
      if (!removido) {
        return notFound(404, new BasicResponseDto("Usuário não encontrado para remoção.", undefined));
      }
      return success(200, new BasicResponseDto("Usuário removido com sucesso!", undefined));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }
}