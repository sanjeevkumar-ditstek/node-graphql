import { Server } from './helper/server';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const Port = process.env.PORT;  
const server = new Server(Number(Port));
server.start();

mongoose.Promise = Promise
mongoose.connect("mongodb+srv://amarjeetsingh:hl70HFIFMEhPwgJl@cluster0.tjqtwkl.mongodb.net/test-graphQl?retryWrites=true&w=majority")
console.log('====mongodb connected!====');
mongoose.connection.on('error', (error: Error) => console.log(error))
