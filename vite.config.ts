import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    }
  },
  // define: {
  //   __VITE_API_URL__: JSON.stringify(process.env.VITE_API_URL)
  // }  
});

// console.log('Vite Config Environment:', {
//   VITE_API_URL: process.env.VITE_API_URL,
//   NODE_ENV: process.env.NODE_ENV
// });