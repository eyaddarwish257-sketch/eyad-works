import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Bot, ExternalLink, Minus, Send, Sparkles, X } from 'lucide-react'
import type { Language } from '../data/siteData'

type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  projectLinks?: Array<{ name: string; url: string }>
  showContactCta?: boolean
}

type ChatResponse = {
  message?: string
  projectLinks?: Array<{ name: string; url: string }>
  showContactCta?: boolean
  error?: string
}

const quickQuestions = {
  en: ['Who is Eyad?', 'What can Eyad build?', 'What technologies does he use?', 'Show me his projects', 'How can I contact Eyad?'],
  ar: ['من هو إياد؟', 'ماذا يستطيع إياد أن يبني؟', 'ما التقنيات التي يستخدمها؟', 'اعرض مشاريعه', 'كيف يمكنني التواصل مع إياد؟'],
}

const unavailableMessage = {
  en: "I'm having trouble connecting right now. Please try again in a moment or contact Eyad directly.",
  ar: 'أواجه مشكلة في الاتصال الآن. يرجى المحاولة مرة أخرى بعد قليل أو التواصل مع إياد مباشرة.',
}

const greeting = {
  en: 'Hi, I am Eyad AI. Ask me about Eyad, his work, skills, projects, or services.',
  ar: 'مرحبًا، أنا Eyad AI. اسألني عن إياد أو أعماله أو مهاراته أو مشاريعه أو خدماته.',
}

function formatTime(language: Language) {
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())
}

export function AIChatbot({ language }: { language: Language }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)
  const activeLanguage = language
  const direction = activeLanguage === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    if (!isOpen || isMinimized) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen, isMinimized, isTyping])

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ id: nextId.current++, role: 'assistant', content: greeting[activeLanguage], timestamp: formatTime(activeLanguage) }])
    }
  }, [activeLanguage, messages.length])

  const sendMessage = async (value = input) => {
    const content = value.trim()
    if (!content || isTyping || content.length > 1200) return

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: 'user',
      content,
      timestamp: formatTime(activeLanguage),
    }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: activeLanguage,
          messages: nextMessages.map(({ role, content: messageContent }) => ({ role, content: messageContent })),
        }),
      })
      const data = await response.json() as ChatResponse
      if (!response.ok || !data.message) throw new Error(data.error || 'Request failed')

      setMessages((current) => [...current, {
        id: nextId.current++,
        role: 'assistant',
        content: data.message as string,
        timestamp: formatTime(activeLanguage),
        projectLinks: data.projectLinks,
        showContactCta: data.showContactCta,
      }])
    } catch {
      setMessages((current) => [...current, {
        id: nextId.current++,
        role: 'assistant',
        content: unavailableMessage[activeLanguage],
        timestamp: formatTime(activeLanguage),
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] sm:bottom-6 sm:right-6" dir={direction}>
      <AnimatePresence initial={false}>
        {isOpen && !isMinimized && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            aria-label="Eyad AI chat"
            className="mb-3 flex h-[min(680px,calc(100vh-110px))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.6rem] border border-[var(--line)] bg-[var(--bg-elevated)] shadow-[0_24px_80px_rgba(2,6,23,0.38)]"
          >
            <header className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--card)] px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]">
                  <Bot size={20} />
                  <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-[var(--bg-elevated)] bg-emerald-400 px-1 text-[8px] font-black text-slate-950">AI</span>
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-[var(--heading)]">Eyad AI</h2>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-[var(--muted)]">{activeLanguage === 'ar' ? 'اسألني عن إياد وأعماله ومهاراته ومشاريعه.' : 'Ask me anything about Eyad, his work, skills, and projects.'}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={() => setIsMinimized(true)} aria-label="Minimize chat" className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--soft)] hover:text-[var(--heading)]"><Minus size={16} /></button>
                <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat" className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--soft)] hover:text-[var(--heading)]"><X size={16} /></button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages.length === 1 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {quickQuestions[activeLanguage].map((question) => (
                    <button key={question} type="button" onClick={() => void sendMessage(question)} className="rounded-full border border-[var(--line)] bg-[var(--soft)] px-3 py-2 text-start text-[11px] text-[var(--heading)] transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
                      {question}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[86%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-md bg-[var(--accent)] text-white' : 'rounded-bl-md border border-[var(--line)] bg-[var(--card)] text-[var(--text)]'}`}>
                        {message.content}
                      </div>
                      <span className="mt-1 px-1 text-[10px] text-[var(--muted)]">{message.timestamp}</span>
                      {message.projectLinks && message.projectLinks.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.projectLinks.map((project) => (
                            <a key={project.url} href={project.url} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--soft)] px-3 py-1.5 text-[11px] font-semibold text-[var(--heading)] transition hover:border-[var(--accent)]">
                              {project.name} <ExternalLink size={12} />
                            </a>
                          ))}
                        </div>
                      )}
                      {message.showContactCta && (
                        <a
                          href="#contact"
                          onClick={(event) => {
                            event.preventDefault()
                            setIsOpen(false)
                            const section = document.getElementById('contact')
                            if (section) {
                              section.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            } else {
                              window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
                            }
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:-translate-y-0.5"
                        >
                          {activeLanguage === 'ar' ? 'لنعمل معًا' : "Let's Work Together"} <ArrowRight size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-[var(--line)] bg-[var(--card)] px-3.5 py-3 text-[var(--muted)]" aria-label="Eyad AI is typing">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={(event) => { event.preventDefault(); void sendMessage() }} className="border-t border-[var(--line)] bg-[var(--card)] p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-[var(--line)] bg-[var(--soft)] p-2 focus-within:border-[var(--accent)]">
                <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} maxLength={1200} rows={1} placeholder={activeLanguage === 'ar' ? 'اكتب سؤالك...' : 'Ask Eyad AI...'} aria-label={activeLanguage === 'ar' ? 'رسالتك' : 'Your message'} className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-[var(--heading)] outline-none placeholder:text-[var(--muted)]" />
                <button type="submit" disabled={!input.trim() || isTyping} aria-label="Send message" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"><Send size={16} /></button>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {isOpen && isMinimized && (
        <button type="button" onClick={() => setIsMinimized(false)} className="mb-3 flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-xs font-semibold text-[var(--heading)] shadow-xl" aria-label="Restore chat">
          <Sparkles size={14} className="text-[var(--accent)]" /> Eyad AI
        </button>
      )}

      {!isOpen && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -3, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => { setIsOpen(true); setIsMinimized(false) }}
          className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-[0_12px_38px_var(--accent-soft)]"
          aria-label="Ask Eyad AI"
          title="Ask Eyad AI"
        >
          <Bot size={23} />
          <span className="absolute -right-1 -top-2 rounded-full border-2 border-[var(--bg)] bg-emerald-400 px-1.5 py-0.5 text-[9px] font-black text-slate-950">AI</span>
          <span className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-xl transition group-hover:opacity-100">Ask Eyad AI</span>
        </motion.button>
      )}
    </div>
  )
}
