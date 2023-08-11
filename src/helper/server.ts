import express, { Application, Request, Response } from "express";
import http from "http";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { ApolloServer  } from "@apollo/server";
import { expressMiddleware ,  } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer  } from "@apollo/server/plugin/drainHttpServer";
import {
    GraphQLUpload,
    graphqlUploadExpress,
  } from'graphql-upload';

import typeDefs from "../schema";
import resolvers from "../resolvers";
import { json } from "body-parser";
import { extractBearerToken } from "../utils/auth/userAuth";
import { ApolloError } from "apollo-server-express";
import { JoiError } from "./joiErrorHandler";
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { UserSchema } from "../schema/userSchema";
import { ExecutionArgs, buildSchema , execute } from "graphql";
import { useSofa  } from 'sofa-api';
import { createSchema } from 'graphql-yoga'
import ErrorMessageEnum from "../utils/enum/errorMessage";
import STATUS_CODES from "../utils/enum/statusCodes";

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
    this.app.use(graphqlUploadExpress());
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
      csrfPrevention: false,
      cache: 'bounded',
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        // ApolloServerPluginLandingPageDisabled(),
        {
          async requestDidStart(initialRequestContext) {
            return {
              async willSendResponse(requestContext: any) {
                const { response, errors } = requestContext;
                if (errors) {
                  response.http.status = STATUS_CODES.BAD_REQUEST;
                  const resError: any = [];
                  errors.forEach((error: any) => {
                    resError.push({
                      message: error.message,
                      code: error.extensions
                        ? error.extensions.code
                        : ErrorMessageEnum.INTERNAL_ERROR,
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
        if(formattedError.message === `${ErrorMessageEnum.GRAPH_QL_ERROR}\n`){
          return {message: formattedError.message, statusCode: STATUS_CODES.NOT_FOUND };
        }
        return formattedError;
      },
    });
    await server.start();
    this.app.use(
      "/graphql",
      cors<cors.CorsRequest>(),
      json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          return { token: extractBearerToken(req) 
          }},
      })
    );

    this.app.use(
      '/api',
      useSofa({
        basePath: '/api',
        schema: createSchema({
          typeDefs,
          resolvers,
        }),
        async context({ req  }:any) {
          if(!req.body){
            return new ApolloError(
              ErrorMessageEnum.BODY_IS_NOT_PROVIDED,
              STATUS_CODES.BAD_REQUEST.toString()
            );
          }
          return {
            args: req.body,
            token: req?.headers?.authorization ? req?.headers?.authorization : null
          };
        },
      })  
    );

    await new Promise<void>((resolve) =>
      this.app.listen({ port: this.port }, resolve)
    );
    console.log(`🚀 Server ready at http://localhost:${this.port}`);
    console.log(
      `🚀 Graphql Server ready at http://localhost:${this.port}/graphql`
    );
  }
}
