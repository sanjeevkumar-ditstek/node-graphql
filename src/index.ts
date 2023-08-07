import { Server } from './helper/server';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const Port = process.env.PORT;  
const server = new Server(Number(Port));
server.start();

mongoose.connect(process.env.MONGO_URL? process.env.MONGO_URL : "")
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + process.env.MONGO_URL);
}); 

mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
});