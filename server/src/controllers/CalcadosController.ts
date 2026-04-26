import { Request, Response } from "express";
import prisma from "@database";
import CalcadosRepository from "../repositories/CalcadosRepository";

// Instanciando o repositório para usar as funções do Desafio Extra
const repository = new CalcadosRepository();

export default class CalcadosController {
  
  // 1. CREATE (Criar) - Cadastra um novo calçado no estoque
  async create(req: Request, res: Response) {
    try {
      const { nome_produto, cor, marca, tamanho, preco, quantidade_em_estoque } = req.body;

      const novoCalcado = await prisma.calcado.create({
        data: {
          nome_produto,
          cor,
          marca,
          tamanho,
          preco,
          quantidade_em_estoque,
        },
      });

      return res.status(201).json(novoCalcado);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar calçado." });
    }
  }

  // 2. READ (Ler/Consultar) - Lista todos os calçados cadastrados
  async read(req: Request, res: Response) {
    try {
      const calcados = await prisma.calcado.findMany();
      return res.status(200).json(calcados);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar calçados." });
    }
  }

  // 3. UPDATE (Atualizar) - Modifica informações de um calçado existente
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome_produto, cor, marca, tamanho, preco, quantidade_em_estoque } = req.body;

      const calcadoAtualizado = await prisma.calcado.update({
        where: { id: Number(id) },
        data: {
          nome_produto,
          cor,
          marca,
          tamanho,
          preco,
          quantidade_em_estoque,
        },
      });

      return res.status(200).json(calcadoAtualizado);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar calçado. Verifique se o ID existe." });
    }
  }

  // 4. DELETE (Excluir) - Remove um calçado do sistema
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.calcado.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({ message: "Calçado removido com sucesso!" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao deletar calçado. Verifique se o ID existe." });
    }
  }

  // ==========================================
  // MÉTODOS DO DESAFIO EXTRA
  // ==========================================

  // Busca calçados por tamanho
  async buscarPorTamanho(req: Request, res: Response) {
    try {
      const { tamanho } = req.params;
      const calcados = await repository.buscarPorTamanho(Number(tamanho));
      return res.status(200).json(calcados);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar calçados pelo tamanho." });
    }
  }

  // Filtra calçados pela marca
  async filtrarPorMarca(req: Request, res: Response) {
    try {
      const { marca } = req.params;
      const calcados = await repository.filtrarPorMarca(marca);
      return res.status(200).json(calcados);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao filtrar calçados pela marca." });
    }
  }

  // Conta o total de pares no estoque
  async totalPares(req: Request, res: Response) {
    try {
      const total = await repository.contarTotalPares();
      return res.status(200).json({ total_pares_estoque: total });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao calcular o total de pares." });
    }
  }
}