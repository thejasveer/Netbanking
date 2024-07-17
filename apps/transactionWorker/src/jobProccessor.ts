import { proccessRampTxn } from './proccessRampTxn';
import { jobQueue, pub, sub } from './utils/redisClient';


export async function processRampJobs() {
    while (true) {
 
            try {
                const submission:[string, string]|null = await jobQueue.brpop("TRANSACTIONS_QUEUE", 0);
                if(submission){
                await proccessRampTxn(JSON.parse(submission[1]));
                }
         
          
            } catch (error) {
 
                console.error("Error processing OffRamp submission:", error);
                // Implement your error handling logic here. For example, you might want to push
                // the submission back onto the queue or log the error to a file.
            }
    }
    
  }
 
 