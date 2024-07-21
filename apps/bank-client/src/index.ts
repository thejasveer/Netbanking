import express from 'express';
import { getLoginToken } from './utils/trpc';
import cors from 'cors'
import dotenv from 'dotenv'
 
dotenv.config({ path:"./../../.env" })
 
 
const app = express();

const TRPC_CLIENT_PORT=process.env.TRPC_CLIENT_PORT!
 
app.use(cors())
app.use(express.json());
app.post('/', async (req, res) => {
  try {
      const {username,password} = req.body
      const token= await getLoginToken(username,password) ;
      res.status(200).json({ token:token });
  } catch (error) {
      console.error('Error executing main:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(TRPC_CLIENT_PORT, () => {
  console.log('Server is running on port '+TRPC_CLIENT_PORT);
});