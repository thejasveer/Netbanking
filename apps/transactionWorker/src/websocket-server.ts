import WebSocket,  { WebSocketServer } from 'ws';
  import {sub} from './utils/redisClient'
 const clients: Record<string,WebSocket>= {}

 
 interface IncomingMessage {
  userId?: string;
  [key: string]: any; // For other possible properties
}

export function startWebSocketServer(server: any){
    const wss = new WebSocketServer({ server: server });
    console.log("Web Socket server started")
    wss.on('connection', function connection(ws: WebSocket) {
      
      ws.on('error', console.error);
        ws.on('error', console.error);
        let userId: string | null = null;
    //on message
    ws.on('message',(message)=>{
        try {
            const data:IncomingMessage = JSON.parse(message.toString())
            if (data.userId) {
                // userId = data.userId;
               clients[data.userId] = ws;
                 console.log(`User ${data.userId} connected`);
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
  // Subscribing to the channel the channel
 sub.subscribe('transactions-status', (err, count) => {
    if (err) {
      console.error("Failed to subscribe: %s", err.message);
    } else {
      console.log(`Subscribed to ${count} channel(s). Waiting for updates on the 'transactions-status' channel.`);
    }
  });
  

  // Handle messages from the channel
  sub.on('message', (channel, message) => {
    if (channel === 'transactions-status') {
      console.log(`Received message from ${channel}: ${message}`);
      try {
        const { userId, token, status } = JSON.parse(message);
        const client = clients[userId];
        if (client) {
          client.send(JSON.stringify({ userId, token, status }));
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    }
  });
 
}
 
 