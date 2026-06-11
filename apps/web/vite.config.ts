import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { emptyOutDir: false },
  server: {
    proxy: {
      '/api': {
        target: 'https://sansofe.kripta.dev',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const cookies = proxyRes.headers['set-cookie']
            if (cookies) {
              proxyRes.headers['set-cookie'] = cookies.map(c =>
                c.replace(/;\s*Secure/gi, '').replace(/;\s*SameSite=\w+/gi, '')
              )
            }
          })
        },
      },
    },
  },
})
