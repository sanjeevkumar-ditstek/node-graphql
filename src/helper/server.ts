import express, { Application, Request, Response } from "express";
import http from "http";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import routes from "../routes/index";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import typeDefs from "../schema";
import resolvers from "../resolvers";
import { json } from "body-parser";
import { extractBearerToken } from "../utils/auth/userAuth";

interface MyContext {
  token?: string;
}

dotenv.config();
export class Server {
  private app: Application;
  private port: number;
  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.configureRoutes();
    this.configureMiddleWare();
  }

  private configureRoutes(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("Basic Crud Application!");
    });
  }

  private configureMiddleWare(): void {
    this.app.use(
      cors({
        credentials: true,
      })
    );
    this.app.use(compression());
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    routes(this.app);
  }

  public addMiddleware(middleware: any): void {
    this.app.use(middleware);
  }

  public getApp(): any {
    return this.app;
  }

  public async start(): Promise<void> {
    const httpServer = http.createServer(this.app);
    const server = new ApolloServer<MyContext>({
      typeDefs,
      resolvers,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async requestDidStart(initialRequestContext) {
            return {
              async willSendResponse(requestContext: any) {
                const { response, errors } = requestContext;
               response.http.status = 400
                if (errors) {
                  const resError: any = [];
                  errors.forEach((error: any) => {
                    resError.push({
                      message: error.message,
                      code: error.extensions
                        ? error.extensions.code
                        : "INTERNAL_SERVER_ERROR",
                    });
                  });
                  response.body.singleResult.errors = resError;
                }
              },
            };
          },
        },
      ],
      formatError: (formattedError, error) => {
        return formattedError;
      },
    });
    await server.start();
    this.app.use(
      "/graphql",
      cors<cors.CorsRequest>(),
      json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({ token: extractBearerToken(req) }),
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: this.port }, resolve)
    );
    console.log(`🚀 Server ready at http://localhost:${this.port}`);
    console.log(
      `🚀 Graphql Server ready at http://localhost:${this.port}/graphql`
    );
  }
}
