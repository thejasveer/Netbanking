import { createClient } from "redis";
import { proccessTxn } from "./process";
import dotenv from 'dotenv'
const client = createClient({
    url: process.env.REDIS_URL ,
});

dotenv.config({ path: __dirname + "/../.env" })
export const SECRET = process.env.JWT_SECRET;
export const WEBHOOK_URL = process.env.WEBHOOK_URL||'http://localhost:3002/bankWebhook';


async function startWorker() {

    try {
        await client.connect();
        console.log("Worker connected to Redis.");

        // Main loop
        // while (true) {
            try {
                const submission = {
                    key: 'OffRamp__TRANSACTIONS_QUEUE',
                    element: '"eyJhbGciOiJIUzI1NiJ9.eyJhbW91bnQiOjIyMDAsInR5cGUiOiJPTl9SQU1QIiwiaWF0IjoxNzE4ODcyNTQ3LCJleHAiOjE3MTg4Nzg1NDd9.1oTTQ6hkXWZBVN0CJGiTzgshYKkZN58gnDaMjtsHBAA"'
                  };//await client.brPop("OffRamp__TRANSACTIONS_QUEUE", 0);
             
                // @ts-ignore
                 await proccessTxn(JSON.parse(submission.element));
            } catch (error) {
                console.error("Error processing submission:", error);
                // Implement your error handling logic here. For example, you might want to push
                // the submission back onto the queue or log the error to a file.
            }
        // }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startWorker();