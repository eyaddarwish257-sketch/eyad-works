import { handleChatRequest } from '../server/chatHandler.js'

type ApiRequest = {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
}

type ApiResponse = {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
  setHeader: (name: string, value: string) => void
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  const forwardedFor = request.headers['x-forwarded-for']
  const clientKey = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]?.trim() || 'unknown'
  const result = await handleChatRequest(request.body, clientKey)
  return response.status(result.status).json(result.body)
}
