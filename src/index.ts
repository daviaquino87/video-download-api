import "express-async-errors";

import express from "express";
import cors from "cors";
import { indexRoutes } from "./routes/index.routes";
import { verifyRouteNotFound } from "./middlewares/verify-route-not-found";
import { env } from "./config/env.config";
import { verifyError } from "./middlewares/verify-error";

function bootstrap() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());

  app.use(indexRoutes);

  app.use(verifyRouteNotFound);
  app.use(verifyError);

  app.listen(env.PORT, () => {
    console.log("Server running on port " + env.PORT);
  });
}

bootstrap();
