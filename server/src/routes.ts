import express from "express";
import { readAllUsers } from "./controllers/UserController";
import CalcadosController from "./controllers/CalcadosController"; 

const routes = express.Router();
const calcadosController = new CalcadosController(); 

// Rota de Usuários (existente no boilerplate)
routes.get("/users", readAllUsers);

// ==========================================
// ROTAS DO CRUD DE ESTOQUE (Desafio Principal)
// ==========================================

// CREATE: Cadastra um novo calçado [cite: 109]
routes.post("/calcados", calcadosController.create);

// READ: Consulta todos os calçados cadastrados [cite: 110]
routes.get("/calcados", calcadosController.read);

// UPDATE: Atualiza as informações de um calçado específico [cite: 111]
routes.patch("/calcados/:id", calcadosController.update);

// DELETE: Remove um calçado do sistema [cite: 112]
routes.delete("/calcados/:id", calcadosController.delete);

// ==========================================
// ROTAS DE BUSCA E FILTRO (Desafio Extra)
// ==========================================

// TOTAL: Exibe a contagem total de pares no estoque [cite: 150]
// Esta rota deve vir antes de rotas com parâmetros genéricos para evitar conflitos
routes.get("/calcados/estoque/total", calcadosController.totalPares);

// TAMANHO: Lista calçados por um tamanho específico [cite: 142]
routes.get("/calcados/tamanho/:tamanho", calcadosController.buscarPorTamanho);

// MARCA: Filtra calçados por uma marca determinada [cite: 148]
routes.get("/calcados/marca/:marca", calcadosController.filtrarPorMarca);

export default routes;