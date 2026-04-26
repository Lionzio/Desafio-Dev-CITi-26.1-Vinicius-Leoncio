# Relatório técnico e documentação de desenvolvimento: desafio CITi 26.1

Olá! Eu sou o Vinícius e, como parte do processo de submissão para a subárea de Desenvolvimento do CITi 2026.2, documentei aqui toda a jornada de construção do sistema de gerenciamento de estoque para a loja de calçados. Este documento detalha não apenas o código final, mas os desafios enfrentados, as decisões arquiteturais que tomei e como o projeto pode ser executado.

## 1. O cenário e o objetivo
O projeto nasceu da necessidade de modernizar uma loja de calçados que ainda dependia de controles manuais. Minha missão foi construir uma API RESTful robusta que permitisse realizar as quatro operações fundamentais de dados (CRUD), além de funcionalidades inteligentes de busca e contagem, garantindo segurança e eficiência no controle do estoque.

## 2. Sprint 1: Configuração e desafios
O início do projeto foi focado na infraestrutura. Comecei configurando o ambiente utilizando Docker e Prisma ORM. No entanto, o caminho não foi livre de obstáculos. Abaixo, relato os principais desafios técnicos e como os resolvi:

* **Conflito de gerenciadores:** Inicialmente, tentei utilizar o Yarn, mas como ele não estava configurado globalmente em minha máquina, fiz o pivot estratégico para o NPM, garantindo que o fluxo de instalação não fosse interrompido.
* **A crise das versões do prisma:** Após algumas atualizações automáticas de segurança, enfrentei um erro crítico de incompatibilidade entre o `@swc/cli` e a versão do Node.js definida no Dockerfile (20.9.0). O motor do banco de dados (WASM) parou de responder. Minha solução foi aplicar uma "limpeza nuclear" nas `node_modules` e fixar manualmente as versões do Prisma e do Cliente em 5.2.0 e do SWC em 0.1.62, restaurando a harmonia do ambiente.
* **Host do banco de dados:** Aprendi na prática a diferença entre rodar comandos no terminal local e dentro da rede do Docker. Para realizar as migrações iniciais, utilizei o script `npm run migration` que aponta para o `localhost`, permitindo que meu Windows se comunicasse com o container PostgreSQL.

## 3. Sprint 2 e 3: CRUD, rotas e lógica de implementação

Com o banco de dados sincronizado, desenvolvi o `CalcadosController`. Decidi centralizar as operações básicas em uma classe para manter o código organizado. Abaixo, detalho como cada função foi implementada e o que o código faz nos bastidores:

* **Create (Criar):** A função `create` extrai as informações do calçado (nome, cor, marca, etc.) enviadas no corpo da requisição (`req.body`). Em seguida, utiliza o método `prisma.calcado.create` para persistir esses dados de forma segura no banco de dados, retornando um status `201 Created` e o objeto salvo.
* **Read (Ler):** A função `read` é acionada via GET e não exige parâmetros. Ela chama `prisma.calcado.findMany()` para buscar todos os registros na tabela e os retorna ao cliente com o status `200 OK`.
* **Update (Atualizar):** A função `update` recebe o `id` do calçado pelos parâmetros da URL (`req.params`) e os novos dados pelo `req.body`. Utilizando `prisma.calcado.update`, o sistema busca o calçado pelo ID específico e sobrescreve apenas as propriedades enviadas, garantindo uma atualização precisa.
* **Delete (Excluir):** A função `delete` também captura o `id` via URL. Ela aciona `prisma.calcado.delete` passando esse ID como filtro, removendo permanentemente o registro do banco de dados e retornando uma mensagem de sucesso.

As rotas foram estruturadas no arquivo `routes.ts` seguindo a semântica correta:

| Método | Rota | Descrição |
|---|---|---|
| **POST** | `/calcados` | Aciona o método `create` do Controller. |
| **GET** | `/calcados` | Aciona o método `read` do Controller. |
| **PATCH** | `/calcados/:id` | Aciona o método `update` do Controller. |
| **DELETE** | `/calcados/:id` | Aciona o método `delete` do Controller. |

## 4. Sprint 4: Desafio extra e repository pattern

Para o desafio extra, eu quis ir além de apenas "fazer funcionar". Implementei o padrão **Repository** na pasta `repositories`. O porquê dessa escolha é simples: escalabilidade e separação de responsabilidades. Ao isolar a lógica de busca do Controller, deixo o sistema mais limpo e modular.

Veja como as funcionalidades extras foram codificadas:

* **Busca por tamanho:** No repositório, criei a função `buscarPorTamanho(tamanho)` que executa um `prisma.calcado.findMany` filtrando exatamente pelo número recebido. O Controller apenas recebe o parâmetro da rota `/calcados/tamanho/:tamanho`, repassa para o repositório e devolve a resposta.
* **Filtro por marca:** Para evitar que buscas como "Nike" e "nike" trouxessem resultados diferentes, implementei no repositório a opção `mode: "insensitive"` dentro da query do Prisma. Isso torna a busca mais inteligente e amigável para o usuário final na rota `/calcados/marca/:marca`.
* **Contagem de estoque:** Em vez de trazer todos os dados para a memória da aplicação (o que causaria lentidão em estoques grandes), utilizei a função de agregação nativa do ORM (`prisma.calcado.aggregate`) com o parâmetro `_sum` apontando para a `quantidade_em_estoque`. Assim, o banco de dados faz todo o cálculo pesado e devolve apenas o número final na rota `/calcados/estoque/total`.

## 5. Como executar o projeto
Para rodar este projeto em sua máquina, siga estes passos:

1. Certifique-se de que o **Docker Desktop** está ativo.
2. Crie o arquivo `.env` na pasta `server` com as configurações de banco de dados disponíveis.
3. No terminal, dentro da pasta `server`, execute:
   ```bash
   npm install
   docker compose up -d --build