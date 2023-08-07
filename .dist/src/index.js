"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./helper/server");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Port = process.env.PORT;
const server = new server_1.Server(Number(Port));
server.start();
mongoose_1.default.connect(process.env.MONGO_URL ? process.env.MONGO_URL : "");
mongoose_1.default.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + process.env.MONGO_URL);
});
mongoose_1.default.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});
