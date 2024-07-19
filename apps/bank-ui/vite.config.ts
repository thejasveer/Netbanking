import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
 
dotenv.config({ path: "./../../.env" })

console.log("ss",process.env.VITE_TRPC_SERVER_URL)
 
export default defineConfig({
  plugins: [react()],
 
 
})
