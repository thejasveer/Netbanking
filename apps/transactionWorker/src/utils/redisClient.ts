import {createClient} from 'redis'
import { REDIS_URL } from '..'

export const jobQueue =  createClient({
    url: REDIS_URL
})
export const pub =  createClient({
    url: REDIS_URL
})
export const sub =  createClient({
    url: REDIS_URL
})
jobQueue.on('error', (err) => console.error('jobQueue Redis Client Error', err));
pub.on('error', (err) => console.error('pub Redis Client Error', err));
sub.on('error', (err) => console.error('sub Redis Client Error', err));
jobQueue.connect();
pub.connect();
sub.connect();