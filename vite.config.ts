import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { handleChatRequest } from './server/chatHandler.js'

async function readJsonBody(request: import('node:http').IncomingMessage) {
  const chunks: Buffer[] = []
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk))
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
}

function chatApiPlugin() {
  return {
    name: 'eyad-chat-api',
    configureServer(server: { middlewares: { use: (path: string, handler: (request: import('node:http').IncomingMessage, response: import('node:http').ServerResponse) => void) => void } }) {
      server.middlewares.use('/api/chat', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405
          response.setHeader('Allow', 'POST')
          response.end(JSON.stringify({ error: 'Method not allowed.' }))
          return
        }

        try {
          const body = await readJsonBody(request)
          const forwardedFor = request.headers['x-forwarded-for']
          const clientKey = typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : request.socket.remoteAddress || 'local'
          const result = await handleChatRequest(body, clientKey)
          response.statusCode = result.status
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(result.body))
        } catch {
          response.statusCode = 400
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({ error: 'Invalid request.' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.OPENAI_API_KEY ||= env.OPENAI_API_KEY
  process.env.OPENAI_MODEL ||= env.OPENAI_MODEL

  return {
    plugins: [react(), tailwindcss(), chatApiPlugin()],
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
  }
})
