import express from "express"
import { UsuarioController } from "./controller/UsuarioController"
import { CatalogoController } from "./controller/CatalogoController"
import { LivroController } from "./controller/LivroController"

const app = express()
const port = 3090

const usuarioController = new UsuarioController()
const catalogoController = new CatalogoController()
const livroController = new LivroController()

app.use(express.json());

// Rotas para usuários
app.get("/library/usuarios", usuarioController.listarUsuarios.bind(usuarioController))
app.get("/library/usuarios/:cpf", usuarioController.buscarUsuarioPorCpf.bind(usuarioController))
app.post("/library/usuarios", usuarioController.cadastrarUsuario.bind(usuarioController))
app.put("/library/usuarios/:cpf", usuarioController.atualizarUsuario.bind(usuarioController))
app.delete("/library/usuarios/:cpf", usuarioController.removerUsuario.bind(usuarioController))

// Rotas de catálogo
app.get("/library/categorias-livro", catalogoController.listarCategoriasLivro.bind(catalogoController))
app.get("/library/categorias-usuario", catalogoController.listarCategoriasUsuario.bind(catalogoController))
app.get("/library/cursos", catalogoController.listarCursos.bind(catalogoController))

// Rotas de livros
app.get("/library/livros", livroController.listarLivros.bind(livroController));
app.get("/library/livros/:isbn", livroController.buscarPorISBN.bind(livroController));
app.post("/library/livros", livroController.cadastrarLivro.bind(livroController));
app.put("/library/livros/:isbn", livroController.atualizarLivro.bind(livroController));
app.delete("/library/livros/:isbn", livroController.removerLivro.bind(livroController));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/library`)
});
