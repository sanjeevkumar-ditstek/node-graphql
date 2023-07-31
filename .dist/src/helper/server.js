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
const index_1 = __importDefault(require("../routes/index"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const disabled_1 = require("@apollo/server/plugin/disabled");
const schema_1 = __importDefault(require("../schema"));
const resolvers_1 = __importDefault(require("../resolvers"));
const body_parser_2 = require("body-parser");
const userAuth_1 = require("../utils/auth/userAuth");
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
        (0, index_1.default)(this.app);
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
            plugins: [
                (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
                (0, disabled_1.ApolloServerPluginLandingPageDisabled)(),
                {
                    async requestDidStart(initialRequestContext) {
                        return {
                            async willSendResponse(requestContext) {
                                const { response, errors } = requestContext;
                                response.http.status = 400;
                                if (errors) {
                                    const resError = [];
                                    errors.forEach((error) => {
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
                if (formattedError.message === "This operation has been blocked as a potential Cross-Site Request Forgery (CSRF). Please either specify a 'content-type' header (with a type that is not one of application/x-www-form-urlencoded, multipart/form-data, text/plain) or provide a non-empty value for one of the following headers: x-apollo-operation-name, apollo-require-preflight\n") {
                    return { message: formattedError.message, statusCode: 404 };
                }
                // const error = getErrorCode(err.)
                return formattedError;
            },
        });
        await server.start();
        this.app.use("/graphql", (0, cors_1.default)(), (0, body_parser_2.json)(), (0, express4_1.expressMiddleware)(server, {
            context: async ({ req }) => ({ token: (0, userAuth_1.extractBearerToken)(req) }),
        }));
        await new Promise((resolve) => httpServer.listen({ port: this.port }, resolve));
        console.log(`🚀 Server ready at http://localhost:${this.port}`);
        console.log(`🚀 Graphql Server ready at http://localhost:${this.port}/graphql`);
    }
}
exports.Server = Server;
