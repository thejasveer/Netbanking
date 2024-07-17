import { useEffect, useRef, useState } from 'react';

export function useWebSocket(userId:number|null) {

  const [messages, setMessages] = useState<{ userId:number, token:string, status :string}|null>(null);
  const ws = useRef<WebSocket | null>(null);
  

  useEffect(() => {
 
    if(userId)  
  {  
    ws.current = new WebSocket(import.meta.env.VITE_WEBSOCKET_WORKER_URL,);

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
      // Send userId after connection is opened
     
      ws.current?.send(JSON.stringify({ userId: userId }));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages( message );
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
}
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId]);

  const sendMessage = (message:any) => {
 
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
 
      ws.current.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage };
}
