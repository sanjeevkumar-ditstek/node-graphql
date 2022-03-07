import { config } from "dotenv";

config();

export const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING || 'mongodb://localhost:27017/Demo';
export const JWT_SECRET = process.env.JWT_SECRET || "thiisecret865776rr4e*&&*e"
export const PORT = process.env.PORT || 4002