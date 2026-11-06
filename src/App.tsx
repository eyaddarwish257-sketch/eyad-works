import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Icon, addCollection } from '@iconify/react'
import deviconCollection from '@iconify-json/devicon/icons.json'
import simpleIconsCollection from '@iconify-json/simple-icons/icons.json'
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  ChevronRight,
  Code2,
  ExternalLink,
  Globe,
  Lock,
  Menu,
  Moon,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Workflow,
  X,
  Zap,
} from 'lucide-react'
import emailjs from '@emailjs/browser'
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  siNodedotjs,
  siPython,
  siPytorch,
  siReact,
  siTailwindcss,
  siTypescript,
} from 'simple-icons'
import { AIChatbot } from './components/AIChatbot'
import { AdminDashboard } from './components/AdminDashboard'
import { AdminPasswordReset } from './components/AdminPasswordReset'
import { createCmsRecord, subscribeToPublishedProjects, type CmsRecord } from './lib/cms'
import { supabaseConfigured } from './lib/supabase'
import {
  contactLinks,
  portfolioContent,
  projects,
  services,
  skillGroups,
  type Project,
  type Language,
  type ThemeMode,
} from './data/siteData'
import { skillIcons } from './data/skillIcons'

addCollection(deviconCollection)
addCollection(simpleIconsCollection)

function toPublicProject(record: CmsRecord): Project {
  const localized = (value: unknown) => ({ en: typeof value === 'string' ? value : '', ar: typeof value === 'string' ? value : '' })
  const validCategories = ['Web', 'Mobile', 'AI', 'Automation', 'Tools', 'Movies & TV / Entertainment', 'Food / Nutrition / Web', 'Health / Wellness / Web'] as const
  const category = validCategories.includes(record.category as typeof validCategories[number]) ? record.category as Project['category'] : 'Web'
  return {
    slug: String(record.slug || record.id),
    name: String(record.title || record.name || 'Untitled project'),
    category,
    description: localized(record.description || record.shortDescription),
    shortDescription: localized(record.shortDescription || record.description),
    technologies: Array.isArray(record.technologies) ? record.technologies.map(String) : [],
    demo: String(record.demo || '#'),
    coverImage: typeof record.coverImage === 'string' ? record.coverImage : undefined,
    screenshots: Array.isArray(record.screenshots) ? record.screenshots.map(String) : [],
    image: String(record.image || 'from-sky-500 via-indigo-500 to-violet-600'),
    accent: String(record.accent || '#7c3aed'),
    overview: localized(record.overview || record.description),
    problem: localized(record.problem),
    solution: localized(record.solution),
    features: [],
    process: [],
    challenges: [],
    results: [],
  }
}

function TechBadge({ icon, label, className }: { icon: typeof siReact; label: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      title={label}
      className={`absolute z-10 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/75 px-2.5 py-1.5 text-[10px] font-medium text-slate-100 shadow-lg shadow-slate-950/30 backdrop-blur-sm ${className ?? ''}`}
      style={{ color: icon.hex }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: icon.svg }}
      />
      <span>{label}</span>
    </div>
  )
}

const personalPhotoUrl = 'https://i.postimg.cc/L8tWGJ2K/photo-2026-09-14-20-49-39.jpg'

function App() {
  return (
    <BrowserRouter>
      <PortfolioApp />
    </BrowserRouter>
  )
}

function ScrollToTop() {
  const location = useLocation()
  const previousPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (previousPathRef.current && previousPathRef.current !== location.pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    previousPathRef.current = location.pathname
  }, [location.pathname])

  return null
}

function smoothScrollToSection(id: string) {
  const section = document.getElementById(id)
  if (!section) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    return
  }

  section.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function PortfolioApp() {
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('eyad-language') as Language | null
    return saved ?? 'en'
  })
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('eyad-theme') as ThemeMode | null
    return saved ?? 'dark'
  })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cmsProjects, setCmsProjects] = useState<Project[]>([])

  useEffect(() => {
    if (!supabaseConfigured) return
    return subscribeToPublishedProjects((records) => setCmsProjects(records.map(toPublicProject)), () => setCmsProjects([]))
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 700)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    localStorage.setItem('eyad-language', language)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  useEffect(() => {
    localStorage.setItem('eyad-theme', theme)
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  const content = portfolioContent[language]

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]" dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language}>
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)]">
          <div className="flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--card)] px-5 py-3 shadow-[var(--shadow-soft)]">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--accent)]" />
            <span className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--heading)]">EYAD</span>
          </div>
        </div>
      )}
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              language={language}
              setLanguage={setLanguage}
              theme={theme}
              setTheme={setTheme}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              content={content}
              projects={cmsProjects.length ? cmsProjects : projects}
            />
          }
        />
        <Route
          path="/project/:slug"
          element={<ProjectDetailPage language={language} theme={theme} setTheme={setTheme} setLanguage={setLanguage} content={content} projects={cmsProjects.length ? cmsProjects : projects} />}
        />
        <Route
          path="/admin"
          element={<AdminDashboard language={language} theme={theme} setTheme={setTheme} setLanguage={setLanguage} />}
        />
        <Route
          path="/admin/login"
          element={<AdminDashboard language={language} theme={theme} setTheme={setTheme} setLanguage={setLanguage} />}
        />
        <Route path="/admin/reset-password" element={<AdminPasswordReset />} />
        <Route path="*" element={<NotFoundPage language={language} theme={theme} setTheme={setTheme} setLanguage={setLanguage} content={content} />} />
      </Routes>
      <AIChatbot language={language} />
    </div>
  )
}

function HomePage({
  language,
  setLanguage,
  theme,
  setTheme,
  mobileOpen,
  setMobileOpen,
  content,
  projects: visibleProjects,
}: {
  language: Language
  setLanguage: (value: Language) => void
  theme: ThemeMode
  setTheme: (value: ThemeMode) => void
  mobileOpen: boolean
  setMobileOpen: (value: boolean) => void
  content: (typeof portfolioContent)[Language]
  projects: Project[]
}) {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  const handleSectionNavigation = (event: ReactMouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault()
    smoothScrollToSection(sectionId)
  }

  const navItems = [
    { key: 'home', href: '#home', label: content.nav.home },
    { key: 'about', href: '#about', label: content.nav.about },
    { key: 'skills', href: '#skills', label: content.nav.skills },
    { key: 'projects', href: '#projects', label: content.nav.projects },
    { key: 'services', href: '#services', label: content.nav.services },
    { key: 'contact', href: '#contact', label: content.nav.contact },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#home" className="text-lg font-black tracking-[0.34em] text-[var(--heading)]">
            EYAD.
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={(event) => handleSectionNavigation(event, item.key)}
                className="relative text-sm font-medium text-[var(--muted)] transition hover:text-[var(--heading)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--heading)]"
              aria-label="Toggle language"
            >
              <Globe size={16} />
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full border border-[var(--line)] bg-[var(--card)] p-2 text-[var(--heading)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
            </button>
            <a href="#contact" onClick={(event) => handleSectionNavigation(event, 'contact')} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-soft)] transition hover:-translate-y-0.5 hover:shadow-xl">
              {content.nav.talk}
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full border border-[var(--line)] bg-[var(--card)] p-2 text-[var(--heading)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-full border border-[var(--line)] bg-[var(--card)] p-2 text-[var(--heading)]"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-[var(--line)] bg-[var(--header)] p-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(event) => {
                    setMobileOpen(false)
                    handleSectionNavigation(event, item.key)
                  }}
                  className="rounded-xl px-3 py-2 text-sm text-[var(--heading)] hover:bg-[var(--soft)]"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                  className="rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm"
                >
                  {language === 'en' ? 'العربية' : 'English'}
                </button>
                <a href="#contact" onClick={(event) => handleSectionNavigation(event, 'contact')} className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">
                  {content.nav.talk}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_32%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.15),_transparent_25%)]" />
          <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-28 lg:pt-20">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="relative z-10"
            >
              <h1 className="mt-0 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.06em] text-[var(--heading)] sm:text-5xl lg:text-7xl">
                {content.hero.title}
              </h1>

              <p className="mt-6 max-w-lg text-lg text-[var(--muted)]">
                {content.hero.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#projects" onClick={(event) => handleSectionNavigation(event, 'projects')} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-soft)] transition hover:-translate-y-0.5 hover:shadow-xl">
                  {content.hero.primary}
                  <ArrowRight size={18} />
                </a>
                <a href="#contact" onClick={(event) => handleSectionNavigation(event, 'contact')} className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--card)] px-6 py-3 text-sm font-semibold text-[var(--heading)] transition hover:-translate-y-0.5 hover:bg-[var(--soft)]">
                  {content.hero.secondary}
                </a>
              </div>

              <div className="mt-12 flex flex-wrap gap-6 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <Code2 size={18} className="text-[var(--accent)]" />
                  {content.hero.intro}
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[var(--accent)]" />
                  {content.hero.summary}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="relative z-10"
            >
              <div className="relative mx-auto flex max-w-[520px] items-center justify-center py-6">
                <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="absolute -right-8 bottom-10 h-24 w-24 rounded-full bg-cyan-500/20 blur-3xl" />

                <div className="relative w-full max-w-[440px]">
                  <TechBadge icon={siReact} label="React" className="left-[-10px] top-8 rotate-[-10deg]" />
                  <TechBadge icon={siTypescript} label="TypeScript" className="right-[-4px] top-14 rotate-[8deg]" />
                  <TechBadge icon={siPytorch} label="AI / ML" className="left-7 top-[-12px] rotate-[6deg]" />
                  <TechBadge icon={siNodedotjs} label="Node.js" className="right-8 bottom-20 rotate-[-6deg]" />
                  <TechBadge icon={siPython} label="Python" className="left-[-12px] bottom-16 rotate-[8deg]" />
                  <TechBadge icon={siTailwindcss} label="Tailwind" className="right-[-8px] bottom-4 rotate-[-8deg]" />

                  <div className="relative overflow-hidden rounded-[2.3rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))] p-3 shadow-[0_25px_80px_rgba(15,23,42,0.24)] backdrop-blur-md">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_38%)]" />
                    <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-slate-950/60 p-2">
                      <img
                        src={personalPhotoUrl}
                        alt="Eyad Darwish portrait"
                        className="h-[520px] w-full max-w-[390px] rounded-[1.5rem] object-cover object-center shadow-[0_18px_45px_rgba(15,23,42,0.45)]"
                        loading="eager"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[var(--shadow-soft)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{content.about.label}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.05em] text-[var(--heading)] sm:text-4xl">
                {content.about.heading}
              </h2>
              <div className="mt-8 space-y-5 text-base leading-8 text-[var(--muted)]">
                <p>{content.about.body1}</p>
                <p>{content.about.body2}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {content.about.stats.map((stat) => (
                <div key={stat.label} className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
                  <div className="text-3xl font-black tracking-[-0.05em] text-[var(--heading)]">{stat.value}</div>
                  <div className="mt-3 text-sm text-[var(--muted)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SkillsSection content={content} />

        <ProjectsSection language={language} content={content} projects={visibleProjects} />

        <ServicesSection language={language} content={content} />

        <ContactSection language={language} content={content} />
      </main>

      <footer className="border-t border-[var(--line)] bg-[var(--header)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[var(--muted)] sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-black tracking-[0.25em] text-[var(--heading)]">EYAD.</span>
            <span>•</span>
            <span>{content.footer.intro}</span>
          </div>
          <p>© 2026 Eyad Darwish. {content.footer.rights}</p>
          </div>
          <div className="flex justify-center border-t border-[var(--line)] pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="group relative rounded-full p-1 text-[var(--muted)]/40 transition hover:text-[var(--muted)] hover:-translate-y-0.5"
              aria-label="Admin Login"
            >
              <Lock size={11} strokeWidth={1.7} />
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">Admin</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}

function SkillsSection({ content }: { content: (typeof portfolioContent)[Language] }) {
  const [search, setSearch] = useState('')
  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase()
    return skillGroups.map((group) => ({
      ...group,
      items: group.items.filter((item) => item.name.toLowerCase().includes(query)),
    }))
  }, [search])

  return (
    <section id="skills" className="bg-[var(--soft)] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{content.skills.label}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-[var(--heading)] sm:text-4xl">
              {content.skills.heading}
            </h2>
          </div>
          <label className="flex w-full max-w-md items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)] shadow-sm md:w-auto">
            <Search size={16} className="text-[var(--accent)]" />
            <input
              aria-label={content.skills.search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={content.skills.search}
              className="w-full bg-transparent text-[var(--heading)] outline-none placeholder:text-[var(--muted)]"
            />
          </label>
        </div>

        <div className="mt-10 grid gap-8">
          {filteredGroups.filter((group) => group.items.length > 0).map((group) => (
            <div key={group.group}>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                <h3 className="text-lg font-semibold text-[var(--heading)]">{group.group}</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {group.items.map((item) => (
                  <SkillItem
                    key={item.name}
                    name={item.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillItem({ name }: { name: string }) {
  const icon = skillIcons[name]

  if (!icon) {
    return null
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--heading)] shadow-sm transition-colors hover:border-[var(--accent)] hover:bg-[var(--soft)]"
      title={name}
    >
      <Icon icon={`${icon.set}:${icon.name}`} width="18" height="18" aria-hidden="true" />
      <span>{name}</span>
    </motion.div>
  )
}

function ProjectsSection({ language, content, projects: projectItems }: { language: Language; content: (typeof portfolioContent)[Language]; projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const filters = content.projectsSection.filter

  const filteredProjects = useMemo(() => {
    const normalized = activeFilter.toLowerCase()
    return projectItems.filter((project) => normalized === 'all' || project.category.toLowerCase() === normalized)
  }, [activeFilter, projectItems])

  return (
    <section id="projects" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{content.projectsSection.label}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-[var(--heading)] sm:text-4xl">
            {content.projectsSection.heading}
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === filter
                  ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]'
                  : 'border border-[var(--line)] bg-[var(--card)] text-[var(--heading)] hover:bg-[var(--soft)]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <motion.article
            key={project.slug}
            whileHover={{ y: -6 }}
            className="group overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[var(--card)] shadow-[var(--shadow-soft)]"
          >
            <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${project.image}`}>
              {project.coverImage && <img src={project.coverImage} alt={`${project.name} cover`} className="absolute inset-0 h-full w-full object-cover" />}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.4),_transparent_26%)]" />
              <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/20 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white">
                {project.category}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-[var(--heading)]">{project.name}</h3>
                <span className="rounded-full border border-[var(--line)] bg-[var(--soft)] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  {project.category}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{project.description[language]}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="rounded-full bg-[var(--soft)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--heading)]">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-7">
                <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-3 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5">
                  <ExternalLink size={15} />
                  {content.projectsSection.live}
                </a>
              </div>

              <Link to={`/project/${project.slug}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--heading)] transition hover:text-[var(--accent)]">
                {content.projectsSection.details}
                <ChevronRight size={16} />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function ServicesSection({ language, content }: { language: Language; content: (typeof portfolioContent)[Language] }) {
  return (
    <section id="services" className="bg-[var(--soft)] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{content.servicesSection.label}</p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-[var(--heading)] sm:text-4xl">
          {content.servicesSection.heading}
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const icons = [Code2, BriefcaseBusiness, Workflow, BrainCircuit, Zap, ShieldCheck]
            const Icon = icons[index % icons.length]
            return (
              <motion.div key={service.title[language]} whileHover={{ y: -5 }} className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
                <span className="inline-flex rounded-2xl bg-[var(--soft)] p-3 text-[var(--accent)]"><Icon size={20} /></span>
                <h3 className="mt-5 text-xl font-semibold text-[var(--heading)]">{service.title[language]}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{service.description[language]}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ContactSection({ content }: { language?: Language; content: (typeof portfolioContent)[Language] }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')
  const [isSending, setIsSending] = useState(false)

  const emailPublicKey = import.meta.env.VITE_EMAIL_PUBLIC_KEY
  const emailServiceId = import.meta.env.VITE_EMAIL_SERVICE_ID
  const emailTemplateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID
  const emailEnabled = Boolean(emailPublicKey && emailServiceId && emailTemplateId)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('')

    const normalizedForm = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    }
    if (!normalizedForm.name || !normalizedForm.email || !normalizedForm.subject || !normalizedForm.message) {
      setStatus('Please complete all fields before sending your message.')
      return
    }
    if (normalizedForm.message.length > 5000) {
      setStatus('Please keep your message under 5000 characters.')
      return
    }

    setIsSending(true)
    const submittedAt = new Date()

    if (supabaseConfigured) {
      try {
        await createCmsRecord('messages', {
          ...normalizedForm,
          status: 'unread',
          date: submittedAt.toISOString().slice(0, 10),
          time: submittedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          order: Date.now(),
        })
      } catch {
        setStatus('Your message could not be saved right now. Please contact me directly by email.')
        setIsSending(false)
        return
      }
    }

    if (!emailEnabled) {
      setStatus(supabaseConfigured
        ? 'Message saved, but email delivery is not configured yet. Please contact me directly using the links below.'
        : 'Email delivery and message storage are not configured yet. Please contact me directly using the links below.')
      setIsSending(false)
      return
    }

    try {
      await emailjs.send(emailServiceId, emailTemplateId, {
        ...normalizedForm,
        to_email: contactLinks.email,
        reply_to: normalizedForm.email,
        from_name: normalizedForm.name,
        subject: `New Portfolio Contact Message: ${normalizedForm.subject}`,
        message_html: `<strong>New Portfolio Contact Message</strong><br><br>Name: ${normalizedForm.name}<br>Email: ${normalizedForm.email}<br>Subject: ${normalizedForm.subject}<br><br>Message:<br>${normalizedForm.message.replace(/\n/g, '<br>')}`,
      }, {
        publicKey: emailPublicKey,
      })
      setStatus('Message sent successfully! Thank you for reaching out. I\'ll get back to you as soon as possible.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('Something went wrong. Your message was saved, but email delivery failed. Please try again or contact me directly using the links below.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{content.contact.label}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-[var(--heading)] sm:text-4xl">
            {content.contact.heading}
          </h2>

          <div className="mt-8 space-y-4 text-sm text-[var(--muted)]">
            <a href={`mailto:${contactLinks.email}`} className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 transition hover:border-[var(--accent)]">
              <SocialIcon name="simple-icons:gmail" label="Email" />
              {contactLinks.email}
            </a>
            <a href={`tel:${contactLinks.phone.replace(/\s+/g, '')}`} className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 transition hover:border-[var(--accent)]">
              <Phone size={16} className="text-[var(--accent)]" />
              {contactLinks.phone}
            </a>
            <a href={contactLinks.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="group flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
              <SocialIcon name="simple-icons:github" label="GitHub" />
              GitHub
            </a>
            <a href={contactLinks.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="group flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
              <SocialIcon name="simple-icons:linkedin" label="LinkedIn" />
              LinkedIn
            </a>
            <a href={contactLinks.x} target="_blank" rel="noreferrer" aria-label="X" className="group flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
              <SocialIcon name="simple-icons:x" label="X" />
              X
            </a>
            <a href={contactLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="group flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
              <SocialIcon name="simple-icons:facebook" label="Facebook" />
              Facebook
            </a>
            <a href={contactLinks.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="group flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
              <SocialIcon name="simple-icons:whatsapp" label="WhatsApp" />
              WhatsApp
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[var(--line)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--heading)]">
              {content.contact.name}
              <input
                required
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="rounded-2xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--heading)]">
              {content.contact.email}
              <input
                required
                type="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="rounded-2xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              />
            </label>
          </div>

          <label className="mt-5 flex flex-col gap-2 text-sm font-medium text-[var(--heading)]">
            {content.contact.subject}
            <input
              required
              value={formData.subject}
              onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
              className="rounded-2xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
          </label>

          <label className="mt-5 flex flex-col gap-2 text-sm font-medium text-[var(--heading)]">
            {content.contact.message}
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(event) => setFormData({ ...formData, message: event.target.value })}
              className="rounded-2xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            />
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-soft)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? 'Sending...' : content.contact.send}
              <Send size={16} />
            </button>
            <p className="text-sm text-[var(--muted)]">{content.contact.note}</p>
          </div>

          {status && <p className="mt-4 text-sm text-[var(--heading)]">{status}</p>}
        </form>
      </div>
    </section>
  )
}

function SocialIcon({ name, label }: { name: string; label: string }) {
  return <Icon icon={name} width="18" height="18" aria-label={label} className="shrink-0 text-[var(--accent)] transition-transform duration-200 group-hover:scale-110" />
}

function ProjectDetailPage({ language, theme, setTheme, setLanguage, content, projects: projectItems }: {
  language: Language
  theme: ThemeMode
  setTheme: (value: ThemeMode) => void
  setLanguage: (value: Language) => void
  content: (typeof portfolioContent)[Language]
  projects: Project[]
}) {
  const navigate = useNavigate()
  const currentPath = useLocation().pathname
  const slug = currentPath.split('/').pop() || ''
  const project = projectItems.find((item) => item.slug === slug)

  if (!project) {
    return <NotFoundPage language={language} theme={theme} setTheme={setTheme} setLanguage={setLanguage} content={content} />
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="text-lg font-black tracking-[0.34em] text-[var(--heading)]">EYAD.</Link>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm">{language === 'en' ? 'AR' : 'EN'}</button>
            <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full border border-[var(--line)] bg-[var(--card)] p-2 text-[var(--heading)]">{theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}</button>
            <button type="button" onClick={() => navigate('/')} className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">{content.notFound.button}</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className={`rounded-[2rem] border border-[var(--line)] bg-gradient-to-br ${project.image} p-[1px]`}>
          <div className="rounded-[calc(2rem-1px)] bg-[var(--bg)]/90 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{project.category}</p>
                <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[var(--heading)] sm:text-5xl">{project.name}</h1>
              </div>
              <div className="flex items-center gap-3">
                <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white"><ExternalLink size={16} /> {content.projectDetail.live}</a>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--card)] p-6">
                <div className={`relative mb-4 h-60 overflow-hidden rounded-[1.2rem] bg-gradient-to-br ${project.image}`}>{project.coverImage && <img src={project.coverImage} alt={`${project.name} cover`} className="h-full w-full object-cover" />}</div>
                <p className="text-base leading-8 text-[var(--muted)]">{project.overview[language]}</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: content.projectDetail.overview, value: project.overview[language] },
                  { label: content.projectDetail.problem, value: project.problem[language] },
                  { label: content.projectDetail.solution, value: project.solution[language] },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--card)] p-5">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{item.label}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--card)] p-6">
            <h2 className="text-2xl font-bold tracking-[-0.05em] text-[var(--heading)]">{content.projectDetail.features}</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--muted)]">
              {project.features.map((feature) => (
                <li key={feature[language]} className="flex items-start gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-[var(--accent)]" />{feature[language]}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--card)] p-6">
            <h2 className="text-2xl font-bold tracking-[-0.05em] text-[var(--heading)]">{content.projectDetail.tech}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="rounded-full bg-[var(--soft)] px-3 py-2 text-sm font-medium text-[var(--heading)]">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {[
            { heading: content.projectDetail.process, items: project.process },
            { heading: content.projectDetail.challenges, items: project.challenges },
            { heading: content.projectDetail.results, items: project.results },
          ].map((group) => (
            <div key={group.heading} className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--card)] p-6">
              <h2 className="text-xl font-bold tracking-[-0.04em] text-[var(--heading)]">{group.heading}</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--muted)]">
                {group.items.map((item) => (
                  <li key={item[language]} className="flex items-start gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-[var(--accent)]" />{item[language]}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[1.6rem] border border-[var(--line)] bg-[var(--card)] p-6">
          <h2 className="text-2xl font-bold tracking-[-0.05em] text-[var(--heading)]">{content.projectDetail.screenshots}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {(project.screenshots?.length ? project.screenshots : [project.coverImage]).filter(Boolean).map((screenshot, index) => (
              <img key={screenshot} src={screenshot} alt={`${project.name} screenshot ${index + 1}`} className="h-52 w-full rounded-[1.2rem] object-cover" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function NotFoundPage({ language, theme, setTheme, setLanguage, content }: {
  language: Language
  theme: ThemeMode
  setTheme: (value: ThemeMode) => void
  setLanguage: (value: Language) => void
  content: (typeof portfolioContent)[Language]
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 text-[var(--text)]">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">{content.notFound.title}</p>
        <h1 className="mt-5 text-6xl font-black tracking-[-0.08em] text-[var(--heading)]">404</h1>
        <p className="mt-6 text-2xl font-semibold text-[var(--heading)]">{content.notFound.heading}</p>
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-sm">{language === 'en' ? 'AR' : 'EN'}</button>
          <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-sm">{theme === 'dark' ? 'Light' : 'Dark'}</button>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white">
            {content.notFound.button}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App
