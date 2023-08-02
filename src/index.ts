import { Server } from './helper/server';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const Port = process.env.PORT;  
const server = new Server(Number(Port));
server.start();

mongoose.Promise = Promise
mongoose.connect(process.env.MONGO_URL? process.env.MONGO_URL : "")
console.log('====mongodb connected!====');
mongoose.connection.on('error', (error: Error) => console.log(error))
