import   { WebSocketServer } from 'ws';
  import {sub} from './utils/redisClient'
 const clients: Record<string,WebSocket>= {}

 


export function startWebSocketServer(server: any){
    const wss = new WebSocketServer({ server: server });

    wss.on('connection', function connection(ws) {
      ws.on('error', console.error);
        ws.on('error', console.error);
        let userId: string | null = null;
    //on message
    ws.on('message',(message)=>{
        try {
            const data = JSON.parse(message.toString())
            if (data.userId) {
                userId = data.userId;
                if (userId) {
                  clients[userId] = ws;
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

sub.subscribe('transactions-status',(message) => {
    console.log(`Received message: ${message}`);
    // Handle the received message
    const { userId, token, status } = JSON.parse(message);
    // Do some
    const client = clients[userId];
    if (client) {
        client.send(JSON.stringify({ userId, token, status }));
    }//thing with parsedMessage, e.g., send it to connected clients via WebSocket
});
 
}
 
 