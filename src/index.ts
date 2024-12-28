import "express-async-errors";
import express from "express";
import cors from "cors";
import { indexRoutes } from "./routes/index.routes";
import { verifyRouteNotFound } from "./middlewares/verify-route-not-found";
import { env } from "./config/env.config";
import { verifyError } from "./middlewares/verify-error";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";

function configDocs(app: express.Application) {
  const routesFilePath = path.join(__dirname, "swagger.json");

  const routesConfig = JSON.parse(fs.readFileSync(routesFilePath, "utf-8"));

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Video Downloader API",
        version: "1.0.0",
        description: "API para download de vídeos do YouTube",
      },
      paths: {},
    },
    apis: ["./routes/*.ts"],
  };

  routesConfig.forEach((route: any) => {
    const { path, method, summary, responses, parameters } = route;

    const swaggerDoc = {
      [path]: {
        [method]: {
          summary,
          responses,
          parameters: parameters || [],
        },
      },
    };

    options.definition.paths = {
      ...options.definition.paths,
      ...swaggerDoc,
    };
  });

  const swaggerSpec = swaggerJSDoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

function bootstrap() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());

  if (env.NODE_ENV === "development") {
    configDocs(app);
  }

  app.use(indexRoutes);

  app.use(verifyRouteNotFound);
  app.use(verifyError);

  app.listen(env.PORT, () => {
    console.log("Server running on port " + env.PORT);
  });
}

bootstrap();
