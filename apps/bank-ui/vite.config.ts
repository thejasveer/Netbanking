import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from 'path';
const envFilePath = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, './../../dockerEnv/.env.bankUi')
  : path.resolve(__dirname, './../../.env.bankUi.dev');

 
dotenv.config({ path: envFilePath });
 
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
 
})
