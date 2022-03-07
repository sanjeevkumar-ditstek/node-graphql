import { config } from "dotenv";
import App from "./app";
import { PORT } from "./env";
import { logger } from './service/logger/logger'
try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = config();
    if (result && result.parsed) {
        Object.keys(result.parsed).forEach((key) => {
            process.env[key] = result.parsed[key];
        });
    }
} catch (e) {
    logger.log("info", ".env file not found, skipping..");
}
new App(Number(PORT)).listen();
