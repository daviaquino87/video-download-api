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

## 👨🏼‍💻 Tecnologias

As seguintes tecnologias foram usadas para o desenvolvimento desta API:

- [Node.js](https://nodejs.org/docs/latest/api/): Ambiente de execução JavaScript no backend.
- [ytdl-core](https://github.com/distubejs/ytdl-core): Biblioteca para download de vídeos do YouTube.
