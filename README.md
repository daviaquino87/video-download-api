# Video Download API

Aplicação para download de vídeos do YouTube, permitindo baixar vídeos diretamente através de uma URL.

![Badge](https://img.shields.io/badge/video_download-api-%237159c1?style=for-the-badge&logo=ghost)

___

##  🚀 Funcionalidades

- *Download de vídeos*: Faça o download de vídeos do YouTube facilmente.

## 🛠️ Pré-requisitos
* Possuir docker na maquina

## 🎲 Rodando o Backend

###  Primeiro, clone o repositório para a sua máquina local:

```bash
git clone https://github.com/daviaquino87/video-download-api

cd video-download-api
```

### Execute o projeto com docker:

```bash
docker-compose up -d
```

Por padrão, o servidor estará rodando na porta 3000.

## 🌐 Acessando a Documentação
A documentação interativa da API está disponível através do Swagger UI. Para acessá-la, basta visitar:

http://localhost:3000/api-docs

## 👨🏼‍💻 Tecnologias

As seguintes tecnologias foram usadas para o desenvolvimento desta API:

- [Node.js](https://nodejs.org/docs/latest/api/): Ambiente de execução JavaScript no backend.
- [ytdl-core](https://github.com/distubejs/ytdl-core): Biblioteca para download de vídeos do YouTube.
- [minio](https://min.io/docs/minio/linux/index.html): Solução de armazenamento de objetos compatível com S3.
- [Swagger](https://swagger.io/docs/): Ferramenta para documentação e especificação de APIs RESTful, permitindo a criação de documentação interativa.
- [TypeScript](https://www.typescriptlang.org/docs/): Superset do JavaScript, adicionando tipagem estática e melhorando a manutenção e a qualidade do código.
- [Docker](https://docs.docker.com/): Plataforma para automatizar a execução de aplicações dentro de containers, garantindo consistência no ambiente de desenvolvimento e produção.

## ⚠️ Observação

Por utilizar uma biblioteca externa (@distube/ytdl-core), pode ocorrer o erro 403 ao tentar baixar um vídeo, especialmente em momentos em que há mudanças nas permissões de acesso ou bloqueios no YouTube.