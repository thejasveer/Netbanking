import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path:  '../../../dockerEnv/.env.bankUi.dev' });
} else {
  dotenv.config({ path:  '../../../.env.bankUi.dev' });
}

 
export default defineConfig({
  plugins: [react()],
 
})
