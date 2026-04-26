# Relatório técnico e documentação de desenvolvimento: desafio CITi 26.1

Olá! Eu sou o Vinícius e, como parte do processo de submissão para a subárea de Desenvolvimento do CITi 2026.2, documentei aqui toda a jornada de construção do sistema de gerenciamento de estoque para a loja de calçados. Este documento detalha não apenas o código final, mas os desafios enfrentados, as decisões arquiteturais que tomei e como o projeto pode ser executado.

## 1. O cenário e o objetivo
O projeto nasceu da necessidade de modernizar uma loja de calçados que ainda dependia de controles manuais. Minha missão foi construir uma API RESTful robusta que permitisse realizar as quatro operações fundamentais de dados (CRUD), além de funcionalidades inteligentes de busca e contagem, garantindo segurança e eficiência no controle do estoque.

## 2. Sprint 1: Configuração e desafios
O início do projeto foi focado na infraestrutura. Comecei configurando o ambiente utilizando Docker e Prisma ORM. No entanto, o caminho não foi livre de obstáculos. Abaixo, relato os principais desafios técnicos e como os resolvi:

* **Conflito de gerenciadores:** Inicialmente, tentei utilizar o Yarn, mas como ele não estava configurado globalmente em minha máquina, fiz o pivot estratégico para o NPM, garantindo que o fluxo de instalação não fosse interrompido.
* **A crise das versões do prisma:** Após algumas atualizações automáticas de segurança, enfrentei um erro crítico de incompatibilidade entre o `@swc/cli` e a versão do Node.js definida no Dockerfile (20.9.0). O motor do banco de dados (WASM) parou de responder. Minha solução foi aplicar uma "limpeza nuclear" nas `node_modules` e fixar manualmente as versões do Prisma e do Cliente em 5.2.0 e do SWC em 0.1.62, restaurando a harmonia do ambiente.
* **Host do banco de dados:** Aprendi na prática a diferença entre rodar comandos no terminal local e dentro da rede do Docker. Para realizar as migrações iniciais, utilizei o script `npm run migration` que aponta para o `localhost`, permitindo que meu Windows se comunicasse com o container PostgreSQL.

## 3. Sprint 2 e 3: CRUD e rotas
Com o banco de dados sincronizado, desenvolvi o `CalcadosController`. Decidi centralizar as operações básicas (Create, Read, Update, Delete) em uma classe para manter o código organizado. As rotas foram estruturadas no arquivo `routes.ts` seguindo a semântica correta:

| Método | Rota | Descrição |
|---|---|---|
| **POST** | `/calcados` | Cadastra um novo produto. |
| **GET** | `/calcados` | Lista todo o estoque. |
| **PATCH** | `/calcados/:id` | Atualiza dados de um item específico. |
| **DELETE** | `/calcados/:id` | Remove um calçado do sistema. |

## 4. Sprint 4: Desafio extra e repository pattern
Para o desafio extra, eu quis ir além de apenas "fazer funcionar". Implementei o padrão **Repository** na pasta `repositories`. O porquê dessa escolha é simples: escalabilidade. Ao separar a lógica de busca do Controller, deixo o sistema mais limpo e fácil de testar.

* **Busca por tamanho e marca:** Implementei filtros que permitem ao lojista encontrar exatamente o que o cliente procura em segundos.
* **Contagem de estoque:** Em vez de carregar todos os dados na memória, utilizei funções de agregação do Prisma (`_sum`) para que o banco de dados faça o trabalho pesado, garantindo performance mesmo com milhares de itens.

## 5. Como executar o projeto
Para rodar este projeto em sua máquina, siga estes passos:

1. Certifique-se de que o **Docker Desktop** está ativo.
2. Crie o arquivo `.env` na pasta `server` com as configurações de banco de dados disponíveis.
3. No terminal, dentro da pasta `server`, execute:
   ```bash
   npm install
   docker compose up -d --build