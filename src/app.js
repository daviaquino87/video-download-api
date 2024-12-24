const url = require("url");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const downloadController = require("./controllers/downloadController");
const express = require("express");

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Download de Vídeos",
      version: "1.0.0",
      description: "API para download de vídeos do YouTube.",
    },
  },
  apis: ["./src/**/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /download:
 *   get:
 *     summary: Baixa um vídeo a partir de uma URL
 *     description: Esta rota permite baixar um vídeo.
 *     parameters:
 *       - name: url
 *         in: query
 *         description: URL do vídeo a ser baixado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vídeo e áudio baixados e combinados com sucesso
 *         content:
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: URL do vídeo não fornecida
 *       500:
 *         description: Erro ao processar o download
 */
app.get("/download", (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const videoUrl = queryObject.url;

  if (!videoUrl) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Erro: URL do vídeo não fornecida!");
    return;
  }

  downloadController.processDownload(videoUrl, res);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000...");
});
