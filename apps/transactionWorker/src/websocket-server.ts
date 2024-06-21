import WebSocket, { WebSocketServer } from 'ws';
 
import {sub} from './utils/redisClient'
import { WEBSOCKET_SERVER_PORT } from '.';
import express from 'express';

const clients: Record<string,WebSocket>= {}


 
const app = express()
const httpServer = app.listen(WEBSOCKET_SERVER_PORT)


export function startWebSocketServer(){
    const wss = new WebSocketServer({ server:httpServer });
    console.log(wss)
wss.on('connection',(ws)=>{
    let userId: string | null = null;
//on message
ws.on('message',(message)=>{
    try {
        const data = JSON.parse(message.toString())
        if(data.userId){
            userId = data.userId;
            if(userId){
                clients[userId]= ws
            }
            console.log(`User ${userId} connected`);
        }


    } catch (error) {
        console.error('Invalid message format:',message)
        
    }
  })
ws.on('close',()=>{
if(userId){
    delete clients[userId];
    console.log(`User ${userId} disconnected`);
}

})
 });

sub.subscribe('transactions-status')
sub.on('message', (channel, message) => {
    const { userId, token, status } = JSON.parse(message);
    const client = clients[userId];
    if (client) {
        client.send(JSON.stringify({ userId, token, status }));
    }
  });
}

 