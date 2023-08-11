"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const graphql_upload_1 = require("graphql-upload");
const schema_1 = __importDefault(require("../schema"));
const resolvers_1 = __importDefault(require("../resolvers"));
const body_parser_2 = require("body-parser");
const userAuth_1 = require("../utils/auth/userAuth");
const apollo_server_express_1 = require("apollo-server-express");
const sofa_api_1 = require("sofa-api");
const graphql_yoga_1 = require("graphql-yoga");
const errorMessage_1 = __importDefault(require("../utils/enum/errorMessage"));
const statusCodes_1 = __importDefault(require("../utils/enum/statusCodes"));
dotenv_1.default.config();
class Server {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.configureRoutes();
        this.configureMiddleWare();
    }
    configureRoutes() {
        this.app.get("/", (req, res) => {
            res.send("Basic Crud Application!");
        });
    }
    configureMiddleWare() {
        this.app.use((0, cors_1.default)({
            credentials: true,
        }));
        this.app.use((0, compression_1.default)());
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(body_parser_1.default.json());
        this.app.use((0, graphql_upload_1.graphqlUploadExpress)());
    }
    addMiddleware(middleware) {
        this.app.use(middleware);
    }
    getApp() {
        return this.app;
    }
    async start() {
        const httpServer = http_1.default.createServer(this.app);
        const server = new server_1.ApolloServer({
            typeDefs: schema_1.default,
            resolvers: resolvers_1.default,
            csrfPrevention: false,
            cache: 'bounded',
            plugins: [
                (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
                // ApolloServerPluginLandingPageDisabled(),
                {
                    async requestDidStart(initialRequestContext) {
                        return {
                            async willSendResponse(requestContext) {
                                const { response, errors } = requestContext;
                                if (errors) {
                                    response.http.status = statusCodes_1.default.BAD_REQUEST;
                                    const resError = [];
                                    errors.forEach((error) => {
                                        resError.push({
                                            message: error.message,
                                            code: error.extensions
                                                ? error.extensions.code
                                                : errorMessage_1.default.INTERNAL_ERROR,
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
                if (formattedError.message === `${errorMessage_1.default.GRAPH_QL_ERROR}\n`) {
                    return { message: formattedError.message, statusCode: statusCodes_1.default.NOT_FOUND };
                }
                return formattedError;
            },
        });
        await server.start();
        this.app.use("/graphql", (0, cors_1.default)(), (0, body_parser_2.json)(), (0, express4_1.expressMiddleware)(server, {
            context: async ({ req }) => {
                return { token: (0, userAuth_1.extractBearerToken)(req)
                };
            },
        }));
        this.app.use('/api', (0, sofa_api_1.useSofa)({
            basePath: '/api',
            schema: (0, graphql_yoga_1.createSchema)({
                typeDefs: schema_1.default,
                resolvers: resolvers_1.default,
            }),
            async context({ req }) {
                if (!req.body) {
                    return new apollo_server_express_1.ApolloError(errorMessage_1.default.BODY_IS_NOT_PROVIDED, statusCodes_1.default.BAD_REQUEST.toString());
                }
                return {
                    args: req.body,
                    token: req?.headers?.authorization ? req?.headers?.authorization : null
                };
            },
        }));
        await new Promise((resolve) => this.app.listen({ port: this.port }, resolve));
        console.log(`🚀 Server ready at http://localhost:${this.port}`);
        console.log(`🚀 Graphql Server ready at http://localhost:${this.port}/graphql`);
    }
}
exports.Server = Server;
