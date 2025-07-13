import { Body, Controller, Delete, Get, Path, Post, Put, Res, Route, Tags, TsoaResponse } from "tsoa";
import { LivroService } from "../service/LivroService";
import { BasicResponseDto } from "../model/dto/BasicResponseDto";
import { CadastrarLivroDTO, AtualizarLivroDTO } from "../model/dto/LivroDto";

@Route("livros")
@Tags("livros")
export class LivroController extends Controller {
  private livroService = new LivroService();

  @Get()
  async listarLivros(
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() serverError: TsoaResponse<500, BasicResponseDto>
  ) {
    try {
      const livros = await this.livroService.listarLivros();
      return success(200, new BasicResponseDto("Livros listados com sucesso!", livros));
    } catch (error: any) {
      return serverError(500, new BasicResponseDto(error.message, undefined));
    }
  }

  @Get("{isbn}")
  async buscarLivroPorISBN(
    @Path() isbn: string,
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() notFound: TsoaResponse<404, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const livro = await this.livroService.buscarPorISBN(isbn);
      if (!livro) {
        return notFound(404, new BasicResponseDto("Livro não encontrado com o ISBN informado.", undefined));
      }
      return success(200, new BasicResponseDto("Livro encontrado com sucesso!", livro));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }

  @Post()
  async cadastrarLivro(
    @Body() body: CadastrarLivroDTO,
    @Res() created: TsoaResponse<201, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const livro = await this.livroService.cadastrarLivro(body);
      return created(201, new BasicResponseDto("Livro cadastrado com sucesso!", livro));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }

  @Put("{isbn}")
  async atualizarLivro(
    @Path() isbn: string,
    @Body() body: AtualizarLivroDTO,
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() notFound: TsoaResponse<404, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const atualizado = await this.livroService.atualizarLivro(isbn, body);
      if (!atualizado) {
        return notFound(404, new BasicResponseDto("Livro não encontrado para atualização.", undefined));
      }
      return success(200, new BasicResponseDto("Livro atualizado com sucesso!", atualizado));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }

  @Delete("{isbn}")
  async removerLivro(
    @Path() isbn: string,
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() notFound: TsoaResponse<404, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ) {
    try {
      const removido = await this.livroService.removerLivro(isbn);
      if (!removido) {
        return notFound(404, new BasicResponseDto("Livro não encontrado para remoção.", undefined));
      }
      return success(200, new BasicResponseDto("Livro removido com sucesso!", undefined));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, undefined));
    }
  }
}