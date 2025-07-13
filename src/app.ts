import express from "express"
import { UsuarioController } from "./controller/UsuarioController"
import { CatalogoController } from "./controller/CatalogoController"
import { LivroController } from "./controller/LivroController"
import { EmprestimoController } from "./controller/EmprestimoController"
import { EstoqueController } from "./controller/EstoqueController"
import { inicializarTabelas } from "./database/initializer"

const app = express()
const port = 3090

const usuarioController = new UsuarioController()
const catalogoController = new CatalogoController()
const livroController = new LivroController()
const emprestimoController = new EmprestimoController()
const estoqueController = new EstoqueController()

app.use(express.json());

// Rotas para usuários
app.get("/library/usuarios", usuarioController.listarUsuarios.bind(usuarioController))
app.get("/library/usuarios/:cpf", usuarioController.buscarUsuarioPorCpf.bind(usuarioController))
app.post("/library/usuarios", usuarioController.cadastrarUsuario.bind(usuarioController))
app.put("/library/usuarios/:cpf", usuarioController.atualizarUsuario.bind(usuarioController))
app.delete("/library/usuarios/:cpf", usuarioController.removerUsuario.bind(usuarioController))

// Rotas de catálogo
app.get("/library/catalogos/categorias-livro", catalogoController.listarCategoriasLivro.bind(catalogoController))
app.get("/library/catalogos/categorias-usuario", catalogoController.listarCategoriasUsuario.bind(catalogoController))
app.get("/library/catalogos/cursos", catalogoController.listarCursos.bind(catalogoController))

// Rotas de livros
app.get("/library/livros", livroController.listarLivros.bind(livroController));
app.get("/library/livros/:isbn", livroController.buscarPorISBN.bind(livroController));
app.post("/library/livros", livroController.cadastrarLivro.bind(livroController));
app.put("/library/livros/:isbn", livroController.atualizarLivro.bind(livroController));
app.delete("/library/livros/:isbn", livroController.removerLivro.bind(livroController));

// Rotas de empréstimo
app.get("/library/emprestimos", emprestimoController.listarEmprestimos.bind(emprestimoController));
app.post("/library/emprestimos", emprestimoController.cadastrarEmprestimo.bind(emprestimoController));
app.put("/library/emprestimos/:id/devolucao", emprestimoController.registrarDevolucao.bind(emprestimoController));

// Rotas de estoque
app.get("/library/estoque", estoqueController.listarEstoque.bind(estoqueController));
app.get("/library/estoque/:id", estoqueController.buscarPorISBN.bind(estoqueController));
app.post("/library/estoque", estoqueController.cadastrarExemplar.bind(estoqueController));
app.put("/library/estoque/:id", estoqueController.registrarDevolucao.bind(estoqueController));
app.delete("/library/estoque/:id", estoqueController.removerExemplar.bind(estoqueController));

//Rota para verificar os empréstimos em atraso e aplicar suspensão nos usuários sem a necessidade de realizar a devolução.
app.post("/library/emprestimos/verificar-suspensoes", emprestimoController.verificarSuspensoes.bind(emprestimoController));

async function main() {
  await inicializarTabelas()
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/library`)
  })
}

main().catch((err) => {
  console.error("Erro ao iniciar o servidor:", err)
})
