 
 
import dotenv from 'dotenv'
import { startWebSocketServer } from "./websocket-server";
import { processRampJobs  } from "./jobProccessor";
 
dotenv.config({ path: __dirname + "/../.env" })
export const SECRET = process.env.JWT_SECRET;
export const WEBSOCKET_SERVER_PORT = process.env.WEBSOCKET_SERVER_PORT;
export const REDIS_URL = process.env.REDIS_URL 
export const WEBHOOK_URL = process.env.WEBHOOK_URL||'http://localhost:3002/bankWebhook';


 
 startWebSocketServer();

 processRampJobs()