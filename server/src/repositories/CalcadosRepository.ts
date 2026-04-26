import prisma from "@database";

export default class CalcadosRepository {
  
  // 1. Busca por tamanho
  async buscarPorTamanho(tamanho: number) {
    return await prisma.calcado.findMany({
      where: { tamanho },
    });
  }

  // 2. Filtro por marca (ignorando letras maiúsculas/minúsculas)
  async filtrarPorMarca(marca: string) {
    return await prisma.calcado.findMany({
      where: {
        marca: {
          equals: marca,
          mode: "insensitive", // Facilita a busca (ex: "nike" encontra "Nike")
        },
      },
    });
  }

  // 3. Contagem total de pares
  async contarTotalPares() {
    const agregacao = await prisma.calcado.aggregate({
      _sum: {
        quantidade_em_estoque: true,
      },
    });
    
    // Retorna a soma total ou 0 caso o estoque esteja vazio
    return agregacao._sum.quantidade_em_estoque || 0; 
  }
}