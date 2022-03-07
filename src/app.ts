import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import compression from "compression";
import { json } from "body-parser";
import { connect, ConnectOptions } from "mongoose";
import { executableSchema as schema } from "./graphql/schema";
import { MONGO_DB_CONNECTION_STRING, PORT } from "./env";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";
import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "./env";
import { logger } from "./service/logger/logger";
import { graphqlUploadExpress } from "graphql-upload";

export default class App {
  public app: Application;
  public port: number;
  constructor(port = +PORT) {
    this.app = express();
    this.port = port;
    this.connectToMongo();
    this.initializeMiddlewares();
    this.initializeApollo();
  }
  private connectToMongo() {
    connect(`${MONGO_DB_CONNECTION_STRING}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    } as ConnectOptions)
      .then(() => {
        logger.log("info", "Connected to MongoDB...");
      })
      .catch((e) => {
        logger.log("info", "There was an error connecting to MongoDB:");
        logger.error(e);
      });
  }

  private initializeMiddlewares() {
    this.app.use(compression());
    this.app.use(json());
    this.app.use(graphqlUploadExpress());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.app.use(async (req: any, res, next) => {
      const tokenString = req?.headers?.authorization;
      if (tokenString) {
        try {
          const token = tokenString.replace("Bearer ", "");
          const currentUser = Jwt.verify(token, JWT_SECRET);
          if (currentUser) {
            req.currentUser = currentUser;
          }
        } catch (e) {
          logger.error(e);
        }
      }
      next();
    });
  }

  private async initializeApollo() {
    const setHttpPlugin = {
      async requestDidStart() {
        return {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          async willSendResponse({ response }: any) {
            if (response?.errors?.length > 0) {
              const code = Number(response?.errors[0]?.extensions?.code) || 400;
              response.http.status = code;
            }
          },
        };
      },
    };
    const server = new ApolloServer({
      // uploads: true,
      schema,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context: (request: any) => ({
        req: request.req,
      }),
      plugins: [
        process.env.NODE_ENV === "production"
          ? ApolloServerPluginLandingPageDisabled()
          : ApolloServerPluginLandingPageGraphQLPlayground(),
        setHttpPlugin,
      ],
    });

    this.app.get("/", (_, res) => {
      res.status(200).send("Api Server is running");
    });

    await server.start();
    server.applyMiddleware({ app: this.app });
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.log("info", `App listening on the port ${this.port}`);
    });
  }
}
