
# Projeto de um MVP

Projeto de um MVP de registro de documentos para o modulo avançado de smartcontract.


### Tecnologias Utilizadas

- Solidity
- Nest
- PostgreSQL
- Vue.js
- Docker
- Hardhat
- IPFS

# Rodando o projeto

Executando a sequencia de comandos a seguir você vai ter os smarth contracts
rodando em uma blockchain simulada.

```bash

# Rodando os contratos.
# Na pasta blockchain execute a sequencia de comandos
npm install
npx hardhat node

# em um segundo terminal
npx hardhat run script/deploy.ts --network=localhost

```

Para rodar o backend da aplicação execute os seguintes comandos.

```bash

# Na pasta do backend, doc-back-end execute a sequencia de comandos
npm install

# Crie um arquivo .env com base no arquivo de exemplo e modifique seus valores
cp .env.exemplo .env

# O projeto tem um docker-compose para criar um container para o banco de dados
# é possivel utilizar o docker para criar o container ou utilizar o banco de dados
# instalado na maquina.

# Com as variaveis de ambiente configuradas e o banco de dados configurado
npm run start:dev

```

Para executar o frontend siga a sequencia de comandos a seguir.

```bash

# Na pasta do backend, doc-front-end execute a sequencia de comandos
npm install

# Crie um arquivo .env com base no arquivo de exemplo e modifique seus valores
cp .env.exemplo .env

# Quando as variaveis estiverem configuradas você pode executar o front-end.
npm run dev

```