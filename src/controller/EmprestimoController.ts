import { Body, Controller, Get, Path, Post, Put, Res, Route, Tags, TsoaResponse } from "tsoa";
import { EmprestimoService } from "../service/EmprestimoService";
import { BasicResponseDto } from "../model/dto/BasicResponseDto";
import { CadastrarEmprestimoDTO } from "../model/dto/EmprestimoDto";

@Route("emprestimos")
@Tags("emprestimos")
export class EmprestimoController extends Controller {
  private emprestimoService = new EmprestimoService();

  @Get()
  async listarEmprestimos(
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() serverError: TsoaResponse<500, BasicResponseDto>
  ) {
    try {
      const emprestimos = await this.emprestimoService.listarEmprestimos();
      return success(200, new BasicResponseDto("Empréstimos listados com sucesso!", emprestimos));
    } catch (error: any) {
      return serverError(500, new BasicResponseDto(error.message, undefined));
    }
  }

  @Post()
  async cadastrarEmprestimo(
    @Body() body: CadastrarEmprestimoDTO,
    @Res() created: TsoaResponse<201, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const emprestimo = await this.emprestimoService.cadastrarEmprestimo(body);
      return created(201, new BasicResponseDto("Empréstimo registrado com sucesso!", emprestimo));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }

  @Put("{id}/devolucao")
  async registrarDevolucao(
    @Path() id: number,
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() notFound: TsoaResponse<404, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const atualizado = await this.emprestimoService.atualizarEmprestimo(id);
      if (!atualizado) {
        return notFound(404, new BasicResponseDto("Empréstimo não encontrado para devolução.", undefined));
      }
      return success(200, new BasicResponseDto("Empréstimo atualizado com sucesso!", atualizado));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }

  @Post("verificar-suspensoes")
  async verificarSuspensoes(
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() serverError: TsoaResponse<500, BasicResponseDto>
  ) {
    try {
      await this.emprestimoService.verificarSuspensoesEmLotes();
      return success(200, new BasicResponseDto("Verificação de suspensões concluída com sucesso.", undefined));
    } catch (error: any) {
      return serverError(500, new BasicResponseDto(error.message, undefined));
    }
  }
}