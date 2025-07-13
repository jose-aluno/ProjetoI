import { Body, Controller, Delete, Get, Path, Post, Put, Res, Route, Tags, TsoaResponse } from "tsoa";
import { EstoqueService } from "../service/EstoqueService";
import { BasicResponseDto } from "../model/dto/BasicResponseDto";
import { CadastrarEstoqueDTO } from "../model/dto/EstoqueDto";

@Route("estoque")
@Tags("estoque")
export class EstoqueController extends Controller {
  private estoqueService = new EstoqueService();

  @Get()
  async listarEstoque(
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() serverError: TsoaResponse<500, BasicResponseDto>
  ) {
    try {
      const estoques = await this.estoqueService.listarTodos();
      return success(200, new BasicResponseDto("Estoque listado com sucesso!", estoques));
    } catch (error: any) {
      return serverError(500, new BasicResponseDto(error.message, undefined));
    }
  }

  @Get("{isbn}")
  async buscarEstoquePorISBN(
    @Path() isbn: string,
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() notFound: TsoaResponse<404, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const lista = await this.estoqueService.buscarPorISBN(isbn);
      if (!lista || lista.length === 0) {
        return notFound(404, new BasicResponseDto("Nenhum exemplar encontrado para o ISBN informado.", undefined));
      }
      return success(200, new BasicResponseDto("Exemplares encontrados com sucesso!", lista));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }

  @Post()
  async cadastrarExemplar(
    @Body() body: CadastrarEstoqueDTO,
    @Res() created: TsoaResponse<201, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const estoque = await this.estoqueService.cadastrar(body);
      return created(201, new BasicResponseDto("Exemplar cadastrado com sucesso!", estoque));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }

  @Delete("{id}")
  async removerExemplar(
    @Path() id: number,
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() notFound: TsoaResponse<404, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const removido = await this.estoqueService.remover(id);
      if (!removido) {
        return notFound(404, new BasicResponseDto("Exemplar não encontrado para remoção.", undefined));
      }
      return success(200, new BasicResponseDto("Exemplar removido com sucesso!", undefined));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }
}