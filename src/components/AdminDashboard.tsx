import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { Archive, ArrowDown, ArrowUp, ArrowUpRight, Check, Eye, EyeOff, FolderKanban, Image, LayoutDashboard, LogOut, Mail, Menu, MessageSquare, Pencil, Plus, Save, Search, Settings, ShieldCheck, Sparkles, Trash2, Upload, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Language, ThemeMode } from '../data/siteData'
import { supabase, supabaseConfigured } from '../lib/supabase'
import { createCmsRecord, deleteCmsRecord, deleteStoredImage, subscribeToCollection, updateCmsRecord, uploadProjectImage, type CmsRecord } from '../lib/cms'

type AdminDashboardProps = {
  language: Language
  theme: ThemeMode
  setTheme: (value: ThemeMode) => void
  setLanguage: (value: Language) => void
}
type Section = 'overview' | 'projects' | 'skills' | 'services' | 'journey' | 'messages' | 'media' | 'settings' | 'ai'
type CollectionSection = Exclude<Section, 'overview' | 'messages' | 'media' | 'settings' | 'ai'>

const nav: Array<{ id: Section; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'services', label: 'Services', icon: Settings },
  { id: 'journey', label: 'Journey', icon: ArrowUpRight },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'ai', label: 'AI Assistant', icon: ShieldCheck },
  { id: 'settings', label: 'Site Settings', icon: Settings },
]

const collectionNames: Record<CollectionSection, string> = {
  projects: 'projects',
  skills: 'skills',
  services: 'services',
  journey: 'journey',
}

const emptyRecord: Record<CollectionSection, Record<string, string>> = {
  projects: { title: '', slug: '', category: 'Web', shortDescription: '', description: '', technologies: '', coverImage: '', screenshots: '', published: 'false', featured: 'false', order: '0' },
  skills: { name: '', category: 'Languages', icon: '', enabled: 'true', featured: 'false', order: '0' },
  services: { title: '', description: '', icon: '', enabled: 'true', featured: 'false', order: '0' },
  journey: { title: '', date: '', description: '', icon: '', enabled: 'true', order: '0' },
}

function inputValue(value: unknown) {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return String(value)
  return value == null ? '' : String(value)
}

export function AdminDashboard({ language, theme, setTheme, setLanguage }: AdminDashboardProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(Boolean(supabaseConfigured && supabase))
  const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || '')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState(() => (
    (location.state as { passwordUpdated?: boolean } | null)?.passwordUpdated
      ? 'Password updated. Sign in with your new password.'
      : ''
  ))
  const [section, setSection] = useState<Section>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [records, setRecords] = useState<Record<CollectionSection, CmsRecord[]>>({ projects: [], skills: [], services: [], journey: [] })
  const [messages, setMessages] = useState<CmsRecord[]>([])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<{ collection: CollectionSection; record: Record<string, string>; id?: string } | null>(null)
    useEffect(() => {
      const client = supabase
      if (!supabaseConfigured || !client) return

      const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
        const nextUser = session?.user ?? null
        const isAuthorized = Boolean(
          nextUser
          && adminEmail
          && nextUser.email?.toLowerCase() === adminEmail
          && nextUser.app_metadata.role === 'admin',
        )
        setUser(isAuthorized ? nextUser : null)
        setAuthLoading(false)

        if (nextUser && !isAuthorized) {
          window.setTimeout(() => { void client.auth.signOut() }, 0)
          setAuthError('This account is not authorized to access the admin dashboard.')
        } else if (event === 'PASSWORD_RECOVERY') {
          navigate('/admin/reset-password', { replace: true, state: { recoverySessionEstablished: true } })
        } else if (nextUser && location.pathname === '/admin/login') {
          navigate('/admin', { replace: true })
        } else if (!nextUser && location.pathname === '/admin') {
          navigate('/admin/login', { replace: true })
        }
    })
    return () => subscription.unsubscribe()
  }, [adminEmail, location.pathname, navigate])

  useEffect(() => {
    if (!user) return
    const unsubscribers = (Object.keys(collectionNames) as CollectionSection[]).map((name) => subscribeToCollection(collectionNames[name], (items) => setRecords((current) => ({ ...current, [name]: items })), (error) => setToast(error.message)))
    const unsubscribeMessages = subscribeToCollection('messages', setMessages, () => setToast('Unable to load messages.'))
    return () => { unsubscribers.forEach((unsubscribe) => unsubscribe()); unsubscribeMessages() }
  }, [user])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const counts = useMemo(() => ({ projects: records.projects.length, skills: records.skills.length, services: records.services.length, messages: messages.length }), [records, messages])

  const login = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return setAuthError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
    try {
      setAuthError('')
      setAuthNotice('')
      setIsSigningIn(true)
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) setAuthError('Admin account not found or password incorrect. Create the user in Supabase Auth or reset its password.')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign in.')
    } finally {
      setIsSigningIn(false)
    }
  }

  const sendPasswordReset = async () => {
    if (!supabase) return setAuthError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
    if (!adminEmail || email.trim().toLowerCase() !== adminEmail) {
      setAuthError(`Use the configured administrator email: ${adminEmail || 'VITE_ADMIN_EMAIL is not set'}.`)
      return
    }

    try {
      setAuthError('')
      setAuthNotice('')
      setIsSendingReset(true)
      const { error } = await supabase.auth.resetPasswordForEmail(adminEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })
      if (error) throw error
      setAuthNotice('If an admin account exists, a password reset link has been sent to its email.')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to send a password reset email.')
    } finally {
      setIsSendingReset(false)
    }
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  const saveRecord = async () => {
    if (!editing) return
    const { collection: collectionName, record, id } = editing
    if (!record.title && !record.name) return setToast('Add a name or title before saving.')
    const data: Record<string, unknown> = { ...record, order: Number(record.order) || 0 }
    if ('technologies' in data) data.technologies = String(data.technologies).split(',').map((item) => item.trim()).filter(Boolean)
    if ('screenshots' in data) data.screenshots = String(data.screenshots).split(',').map((item) => item.trim()).filter(Boolean)
    for (const key of ['published', 'featured', 'enabled']) if (key in data) data[key] = data[key] === 'true'
    try {
      if (id) await updateCmsRecord(collectionNames[collectionName], id, data)
      else await createCmsRecord(collectionNames[collectionName], data)
      setEditing(null)
      setToast(id ? 'Saved changes.' : 'Created successfully.')
    } catch { setToast('Unable to save. Check Supabase permissions.') }
  }

  const removeRecord = async (collectionName: CollectionSection, record: CmsRecord) => {
    if (!window.confirm(`Are you sure you want to delete this ${collectionName.slice(0, -1)}?`)) return
    try { await deleteCmsRecord(collectionNames[collectionName], record.id); setToast('Deleted successfully.') } catch { setToast('Unable to delete this item.') }
  }

  const updateMessageStatus = async (record: CmsRecord, status: 'unread' | 'read' | 'replied' | 'archived') => {
    try {
      await updateCmsRecord('messages', record.id, { status })
      setToast(`Message marked ${status}.`)
    } catch { setToast('Unable to update message status.') }
  }

  const removeMessage = async (record: CmsRecord) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
    try { await deleteCmsRecord('messages', record.id); setToast('Message deleted.') } catch { setToast('Unable to delete this message.') }
  }

  if (authLoading) return <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--muted)]">Loading secure dashboard...</div>
  if (!supabaseConfigured || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 text-[var(--text)]">
        <form onSubmit={login} className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[var(--shadow-soft)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-white"><ShieldCheck size={22} /></div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Eyad Works CMS</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[var(--heading)]">Secure admin access</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Sign in with the configured Supabase administrator account.</p>
          {!supabaseConfigured || !adminEmail ? <p className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">Admin authentication is not configured. Add VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, and VITE_ADMIN_EMAIL.</p> : (
            <div className="mt-6 space-y-4">
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Admin email" className="w-full rounded-xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
              <div className="relative"><input required type={passwordVisible ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="w-full rounded-xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3 pr-11 text-sm outline-none focus:border-[var(--accent)]" /><button type="button" onClick={() => setPasswordVisible((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--heading)]" aria-label={passwordVisible ? 'Hide password' : 'Show password'}>{passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
              <button disabled={isSigningIn} className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{isSigningIn ? 'Please wait...' : 'Sign in'}</button>
              <div className="text-end text-sm">
                <button type="button" disabled={isSendingReset} onClick={() => void sendPasswordReset()} className="text-[var(--muted)] hover:text-[var(--heading)] disabled:opacity-60">{isSendingReset ? 'Sending link...' : 'Forgot password?'}</button>
              </div>
            </div>
          )}
          {authError && <p className="mt-4 text-sm text-rose-400">{authError}</p>}
          {authNotice && <p className="mt-4 text-sm text-emerald-400">{authNotice}</p>}
          {supabaseConfigured && <p className="mt-4 text-xs leading-5 text-[var(--muted)]">Having trouble signing in? Use Forgot password? to get a recovery link at the configured administrator email.</p>}
          <a href="/" className="mt-6 inline-flex text-sm font-medium text-[var(--muted)] hover:text-[var(--heading)]">Back to website</a>
        </form>
      </div>
    )
  }

  const visibleRecords = section !== 'overview' && section !== 'messages' && section !== 'media' && section !== 'settings' && section !== 'ai'
    ? records[section].filter((record) => JSON.stringify(record).toLowerCase().includes(search.toLowerCase()))
    : []

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--line)] bg-[var(--bg-elevated)] p-5 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">EYAD.WORKS</p><h2 className="mt-2 text-lg font-bold text-[var(--heading)]">Control center</h2></div><button className="rounded-lg p-2 text-[var(--muted)] lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X size={18} /></button></div>
        <nav className="mt-10 space-y-1">{nav.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false); setSearch('') }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition ${section === item.id ? 'bg-[var(--accent)] text-white' : 'text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--heading)]'}`}><Icon size={17} />{item.label}</button> })}</nav>
        <div className="absolute bottom-5 left-5 right-5 space-y-2 border-t border-[var(--line)] pt-4"><a href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--soft)]"><ArrowUpRight size={17} />View website</a><button onClick={() => void logout()} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-300 hover:bg-rose-400/10"><LogOut size={17} />Logout</button></div>
      </aside>
      {sidebarOpen && <button className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation overlay" />}
      <main className="lg:pl-72"><header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--line)] bg-[var(--header)]/90 px-4 py-4 backdrop-blur-xl sm:px-8"><button onClick={() => setSidebarOpen(true)} className="rounded-xl border border-[var(--line)] p-2 text-[var(--heading)] lg:hidden" aria-label="Open sidebar"><Menu size={18} /></button><div className="hidden lg:block"><p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Admin workspace</p><h1 className="mt-1 text-xl font-bold text-[var(--heading)]">{nav.find((item) => item.id === section)?.label}</h1></div><div className="ml-auto flex items-center gap-2"><button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="rounded-xl border border-[var(--line)] px-3 py-2 text-xs font-semibold">{language === 'en' ? 'AR' : 'EN'}</button><button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-xl border border-[var(--line)] px-3 py-2 text-xs font-semibold">{theme === 'dark' ? 'Light' : 'Dark'}</button><span className="hidden rounded-xl bg-[var(--soft)] px-3 py-2 text-xs text-[var(--muted)] sm:inline">{user.email}</span></div></header>
        <div className="mx-auto max-w-7xl p-4 sm:p-8">{section === 'overview' ? <Overview counts={counts} recentProjects={records.projects.slice(0, 4)} messages={messages.slice(0, 4)} /> : section === 'messages' ? <Messages records={messages} onStatusChange={(record, status) => void updateMessageStatus(record, status)} onDelete={(record) => void removeMessage(record)} /> : section === 'media' ? <Placeholder title="Media Library" description="Upload and manage portfolio media through Supabase Storage." icon={Image} /> : section === 'settings' ? <SettingsPanel /> : section === 'ai' ? <Placeholder title="AI Assistant" description="Configure the assistant name, model behavior, suggested questions, and knowledge collections in the CMS." icon={Sparkles} /> : <CollectionManager section={section} records={visibleRecords} search={search} setSearch={setSearch} onCreate={() => setEditing({ collection: section, record: { ...emptyRecord[section] } })} onEdit={(record) => setEditing({ collection: section, record: Object.fromEntries(Object.entries(emptyRecord[section]).map(([key]) => [key, inputValue(record[key])])), id: record.id })} onDelete={(record) => void removeRecord(section, record)} />}</div>
      </main>
      {editing && (editing.collection === 'projects' ? <ProjectEditor record={editing.record} id={editing.id} onChange={(key, value) => setEditing((current) => current ? { ...current, record: { ...current.record, [key]: value } } : current)} onSave={() => void saveRecord()} onClose={() => setEditing(null)} onToast={setToast} /> : <Editor collection={editing.collection} record={editing.record} onChange={(key, value) => setEditing((current) => current ? { ...current, record: { ...current.record, [key]: value } } : current)} onSave={() => void saveRecord()} onClose={() => setEditing(null)} />)}
      {toast && <div className="fixed bottom-5 right-5 z-[70] rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--heading)] shadow-xl">{toast}</div>}
    </div>
  )
}

function Overview({ counts, recentProjects, messages }: { counts: Record<string, number>; recentProjects: CmsRecord[]; messages: CmsRecord[] }) {
  const cards = [{ label: 'Projects', value: counts.projects, icon: FolderKanban }, { label: 'Skills', value: counts.skills, icon: Sparkles }, { label: 'Services', value: counts.services, icon: Settings }, { label: 'Messages', value: counts.messages, icon: MessageSquare }]
  return <div><div className="mb-8"><p className="text-sm text-[var(--muted)]">A live view of your portfolio content.</p><h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[var(--heading)]">Good to see you.</h2></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => { const Icon = card.icon; return <div key={card.label} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5"><Icon size={18} className="text-[var(--accent)]" /><p className="mt-6 text-sm text-[var(--muted)]">{card.label}</p><p className="mt-1 text-3xl font-black text-[var(--heading)]">{card.value}</p></div> })}</div><div className="mt-8 grid gap-6 xl:grid-cols-2"><div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6"><h3 className="font-semibold text-[var(--heading)]">Recent projects</h3><div className="mt-5 space-y-3">{recentProjects.length ? recentProjects.map((item) => <div key={item.id} className="flex items-center justify-between border-b border-[var(--line)] pb-3 text-sm"><span className="text-[var(--heading)]">{inputValue(item.title) || inputValue(item.name)}</span><span className="text-xs text-[var(--muted)]">{item.published ? 'Published' : 'Draft'}</span></div>) : <p className="text-sm text-[var(--muted)]">No projects have been added to the CMS yet.</p>}</div></div><div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6"><h3 className="font-semibold text-[var(--heading)]">Recent messages</h3><div className="mt-5 space-y-3">{messages.length ? messages.map((item) => <div key={item.id} className="border-b border-[var(--line)] pb-3"><p className="text-sm text-[var(--heading)]">{inputValue(item.name) || 'Visitor'}</p><p className="mt-1 truncate text-xs text-[var(--muted)]">{inputValue(item.subject) || inputValue(item.message)}</p></div>) : <p className="text-sm text-[var(--muted)]">No contact messages yet.</p>}</div></div></div></div>
}

function CollectionManager({ section, records, search, setSearch, onCreate, onEdit, onDelete }: { section: CollectionSection; records: CmsRecord[]; search: string; setSearch: (value: string) => void; onCreate: () => void; onEdit: (record: CmsRecord) => void; onDelete: (record: CmsRecord) => void }) {
  return <div><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm text-[var(--muted)]">CMS collection: {collectionNames[section]}</p><h2 className="mt-2 text-3xl font-black capitalize tracking-[-0.05em] text-[var(--heading)]">{section}</h2></div><button onClick={onCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16} />Add {section.slice(0, -1)}</button></div><div className="mt-8 flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 py-3"><Search size={16} className="text-[var(--muted)]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${section}...`} className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" /></div><div className="mt-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)]"><div className="hidden grid-cols-[1fr_150px_100px_90px] gap-4 border-b border-[var(--line)] px-5 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] sm:grid"><span>Name</span><span>Status</span><span>Order</span><span /></div>{records.length ? records.map((record) => <div key={record.id} className="grid gap-3 border-b border-[var(--line)] px-5 py-4 last:border-0 sm:grid-cols-[1fr_150px_100px_90px] sm:items-center sm:gap-4"><div><p className="font-medium text-[var(--heading)]">{inputValue(record.title) || inputValue(record.name) || 'Untitled'}</p><p className="mt-1 text-xs text-[var(--muted)]">{inputValue(record.slug) || inputValue(record.description) || inputValue(record.category) || 'No additional details'}</p></div><span className="text-xs text-[var(--muted)]">{record.published === false || record.enabled === false ? 'Draft / disabled' : 'Active'}</span><span className="text-xs text-[var(--muted)]">{inputValue(record.order) || '0'}</span><div className="flex gap-1"><button onClick={() => onEdit(record)} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--heading)]" aria-label="Edit"><Pencil size={15} /></button><button onClick={() => onDelete(record)} className="rounded-lg p-2 text-rose-300 hover:bg-rose-400/10" aria-label="Delete"><Trash2 size={15} /></button></div></div>) : <div className="px-5 py-12 text-center text-sm text-[var(--muted)]">No records found. Add your first {section.slice(0, -1)}.</div>}</div></div>
}

function ProjectEditor({ record, id, onChange, onSave, onClose, onToast }: { record: Record<string, string>; id?: string; onChange: (key: string, value: string) => void; onSave: () => void; onClose: () => void; onToast: (message: string) => void }) {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [draftId] = useState(() => `draft-${Date.now()}`)
  const projectId = id || draftId
  const screenshots = record.screenshots ? record.screenshots.split(',').map((item) => item.trim()).filter(Boolean) : []

  const uploadFiles = async (files: FileList | File[], target: 'cover' | 'gallery' = 'gallery') => {
    const selected = Array.from(files)
    if (!selected.length) return
    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of selected) urls.push(await uploadProjectImage(file, projectId, setProgress))
      if (target === 'cover') {
        onChange('coverImage', urls.shift() || '')
      }
      if (urls.length) onChange('screenshots', [...screenshots, ...urls].join(', '))
      onToast('Image upload complete. Save the project to publish the URLs.')
    } catch (error) {
      onToast(error instanceof Error ? error.message : 'Image upload failed.')
    } finally { setUploading(false); setProgress(0) }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, target: 'cover' | 'gallery') => { if (event.target.files) void uploadFiles(event.target.files, target) }
  const handleDrop = (event: DragEvent<HTMLLabelElement>, target: 'cover' | 'gallery') => { event.preventDefault(); void uploadFiles(event.dataTransfer.files, target) }
  const removeImage = async (url: string, field: 'coverImage' | 'screenshots') => {
    try { await deleteStoredImage(url) } catch { /* The URL can still be removed from the project. */ }
    onChange(field, field === 'coverImage' ? '' : screenshots.filter((item) => item !== url).join(', '))
  }
  const moveScreenshot = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= screenshots.length) return
    const reordered = [...screenshots]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(nextIndex, 0, moved)
    onChange('screenshots', reordered.join(', '))
  }

  return <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/70 p-0 sm:items-center sm:p-6"><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-[var(--line)] bg-[var(--bg-elevated)] p-6 sm:rounded-3xl"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Project editor</p><h2 className="mt-2 text-2xl font-bold text-[var(--heading)]">Project details and media</h2></div><button onClick={onClose} className="rounded-xl p-2 text-[var(--muted)] hover:bg-[var(--soft)]" aria-label="Close editor"><X size={18} /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{Object.entries(record).filter(([key]) => !['coverImage', 'screenshots'].includes(key)).map(([key, value]) => <label key={key} className="flex flex-col gap-2 text-sm font-medium capitalize text-[var(--heading)]"><span>{key}</span>{['description', 'shortDescription'].includes(key) ? <textarea rows={4} value={value} onChange={(event) => onChange(key, event.target.value)} className="rounded-xl border border-[var(--line)] bg-[var(--soft)] px-3 py-2 outline-none focus:border-[var(--accent)]" /> : <input value={value} onChange={(event) => onChange(key, event.target.value)} className="rounded-xl border border-[var(--line)] bg-[var(--soft)] px-3 py-2 outline-none focus:border-[var(--accent)]" />}</label>)}</div><div className="mt-6"><label onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, 'cover')} className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--soft)] p-6 text-center transition hover:border-[var(--accent)]"><Upload size={20} className="text-[var(--accent)]" /><span className="mt-2 text-sm font-semibold text-[var(--heading)]">Project Cover Image</span><span className="mt-1 text-xs text-[var(--muted)]">Drop or choose JPG, JPEG, PNG, or WebP up to 8 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleFileChange(event, 'cover')} className="sr-only" /></label>{record.coverImage && <div className="relative mt-3 max-w-sm overflow-hidden rounded-xl border border-[var(--line)]"><img src={record.coverImage} alt="Project cover preview" className="h-40 w-full object-cover" /><button type="button" onClick={() => void removeImage(record.coverImage, 'coverImage')} className="absolute right-2 top-2 rounded-lg bg-slate-950/80 p-2 text-white" aria-label="Delete cover image"><Trash2 size={15} /></button></div>}</div><div className="mt-6"><label onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, 'gallery')} className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--soft)] p-6 text-center transition hover:border-[var(--accent)]"><Image size={20} className="text-[var(--accent)]" /><span className="mt-2 text-sm font-semibold text-[var(--heading)]">Project Screenshots</span><span className="mt-1 text-xs text-[var(--muted)]">Drop multiple images or choose files</span><input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => handleFileChange(event, 'gallery')} className="sr-only" /></label>{screenshots.length > 0 && <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{screenshots.map((url, index) => <div key={url} className="relative overflow-hidden rounded-xl border border-[var(--line)]"><img src={url} alt={`Project screenshot ${index + 1}`} className="h-28 w-full object-cover" /><div className="absolute bottom-2 left-2 flex gap-1"><button type="button" disabled={index === 0} onClick={() => moveScreenshot(index, -1)} className="rounded-md bg-slate-950/80 p-1.5 text-white disabled:opacity-40" aria-label="Move screenshot left"><ArrowUp size={13} /></button><button type="button" disabled={index === screenshots.length - 1} onClick={() => moveScreenshot(index, 1)} className="rounded-md bg-slate-950/80 p-1.5 text-white disabled:opacity-40" aria-label="Move screenshot right"><ArrowDown size={13} /></button></div><button type="button" onClick={() => void removeImage(url, 'screenshots')} className="absolute right-2 top-2 rounded-lg bg-slate-950/80 p-2 text-white" aria-label="Delete screenshot"><Trash2 size={14} /></button></div>)}</div>}</div>{uploading && <div className="mt-4"><div className="flex justify-between text-xs text-[var(--muted)]"><span>Uploading images...</span><span>{progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--soft)]"><div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} /></div></div>}<div className="mt-6 flex justify-end gap-3"><button onClick={onClose} className="rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm">Cancel</button><button disabled={uploading} onClick={onSave} className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Save project</button></div></div></div>
}

function Editor({ collection, record, onChange, onSave, onClose }: { collection: CollectionSection; record: Record<string, string>; onChange: (key: string, value: string) => void; onSave: () => void; onClose: () => void }) {
  return <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/70 p-0 sm:items-center sm:p-6"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[var(--line)] bg-[var(--bg-elevated)] p-6 sm:rounded-3xl"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">CMS editor</p><h2 className="mt-2 text-2xl font-bold capitalize text-[var(--heading)]">{collection.slice(0, -1)} details</h2></div><button onClick={onClose} className="rounded-xl p-2 text-[var(--muted)] hover:bg-[var(--soft)]" aria-label="Close editor"><X size={18} /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{Object.entries(record).map(([key, value]) => <label key={key} className="flex flex-col gap-2 text-sm font-medium capitalize text-[var(--heading)]"><span>{key}</span>{key === 'description' || key === 'shortDescription' ? <textarea rows={4} value={value} onChange={(event) => onChange(key, event.target.value)} className="rounded-xl border border-[var(--line)] bg-[var(--soft)] px-3 py-2 outline-none focus:border-[var(--accent)]" /> : <input value={value} onChange={(event) => onChange(key, event.target.value)} className="rounded-xl border border-[var(--line)] bg-[var(--soft)] px-3 py-2 outline-none focus:border-[var(--accent)]" />}</label>)}</div><div className="mt-6 flex justify-end gap-3"><button onClick={onClose} className="rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm">Cancel</button><button onClick={onSave} className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"><Save size={16} />Save</button></div></div></div>
}

function Messages({ records, onStatusChange, onDelete }: { records: CmsRecord[]; onStatusChange: (record: CmsRecord, status: 'unread' | 'read' | 'replied' | 'archived') => void; onDelete: (record: CmsRecord) => void }) {
  return <div><h2 className="text-3xl font-black tracking-[-0.05em] text-[var(--heading)]">Messages</h2><p className="mt-2 text-sm text-[var(--muted)]">Private contact messages from the portfolio.</p><div className="mt-8 space-y-3">{records.length ? records.map((record) => <article key={record.id} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-[var(--heading)]">{inputValue(record.subject) || 'No subject'}</h3><span className="rounded-full bg-[var(--soft)] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">{inputValue(record.status) || 'unread'}</span></div><p className="mt-1 text-xs text-[var(--muted)]">{inputValue(record.name)} · {inputValue(record.email)} · {inputValue(record.date) || 'Date pending'} {inputValue(record.time)}</p></div><div className="flex flex-wrap items-center gap-1"><a href={`mailto:${inputValue(record.email)}?subject=Re: ${encodeURIComponent(inputValue(record.subject) || 'Your message')}`} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--heading)]" aria-label="Reply via email" title="Reply via email"><Mail size={16} /></a><button onClick={() => onStatusChange(record, record.status === 'read' ? 'unread' : 'read')} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--heading)]" aria-label="Toggle read status" title="Mark read or unread"><Check size={16} /></button><button onClick={() => onStatusChange(record, 'archived')} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--heading)]" aria-label="Archive message" title="Archive"><Archive size={16} /></button><button onClick={() => onDelete(record)} className="rounded-lg p-2 text-rose-300 hover:bg-rose-400/10" aria-label="Delete message" title="Delete"><Trash2 size={16} /></button></div></div><p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">{inputValue(record.message)}</p></article>) : <div className="rounded-2xl border border-dashed border-[var(--line)] p-12 text-center text-sm text-[var(--muted)]">No messages yet.</div>}</div></div>
}

function Placeholder({ title, description, icon: Icon }: { title: string; description: string; icon: typeof Image }) { return <div className="max-w-2xl"><Icon size={22} className="text-[var(--accent)]" /><h2 className="mt-5 text-3xl font-black tracking-[-0.05em] text-[var(--heading)]">{title}</h2><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p><div className="mt-8 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] p-8 text-sm text-[var(--muted)]">This module is connected to the CMS architecture and ready for Supabase data.</div></div> }

function SettingsPanel() { return <div><h2 className="text-3xl font-black tracking-[-0.05em] text-[var(--heading)]">Site Settings</h2><p className="mt-2 text-sm text-[var(--muted)]">Safe site-wide settings are stored in Supabase when configured.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5"><p className="text-sm font-semibold text-[var(--heading)]">Public website</p><p className="mt-2 text-sm text-emerald-400">Online</p></div><div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5"><p className="text-sm font-semibold text-[var(--heading)]">Authentication</p><p className="mt-2 text-sm text-emerald-400">Supabase protected</p></div></div></div> }
