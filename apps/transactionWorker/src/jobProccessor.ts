import { proccessRampTxn } from './proccessRampTxn';
import { jobQueue, pub } from './utils/redisClient';


export async function processRampJobs() {
    while (true) {
 
            try {
                const submission = await jobQueue.brpop("TRANSACTIONS_QUEUE", 0);
             // @ts-ignore
             await proccessRampTxn(JSON.parse(submission.element));
            } catch (error) {
                console.error("Error processing OffRamp submission:", error);
                // Implement your error handling logic here. For example, you might want to push
                // the submission back onto the queue or log the error to a file.
            }
    }
    
  }
 
 