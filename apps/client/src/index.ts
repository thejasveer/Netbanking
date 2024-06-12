import express from 'express';
import { getLoginToken } from './trpc';
import cors from 'cors'
const app = express();

app.use(cors())
app.use(express.json());
app.post('/', async (req, res) => {
  try {
      const {username,password} = req.body
      console.log(req.body)
      const token= await getLoginToken(username,password) ;
      res.status(200).json({ token:token });
  } catch (error) {
      console.error('Error executing main:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(3005, () => {
  console.log('Server is running on port 3005');
});