import { createClient } from '@supabase/supabase-js'

type CmsRow = {
  collection: string
  data: Record<string, unknown>
  enabled: boolean
  published: boolean
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY
  || process.env.SUPABASE_ANON_KEY
  || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || process.env.VITE_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null

const collectionNames = ['projects', 'skills', 'services', 'journey']

function isRelevant(query: string, collectionName: string) {
  const normalized = query.toLowerCase()
  const terms: Record<string, string[]> = {
    projects: ['project', 'built', 'work', 'website', 'app', 'مشروع', 'عمل'],
    skills: ['skill', 'technology', 'technologies', 'react', 'python', 'code', 'مهار', 'تقني'],
    services: ['service', 'build', 'offer', 'website', 'mobile', 'api', 'خدم', 'بناء'],
    journey: ['journey', 'education', 'experience', 'دراسة', 'خبرة'],
  }
  return terms[collectionName]?.some((term) => normalized.includes(term)) ?? false
}

export async function retrievePortfolioContext(query: string) {
  if (!supabase) return 'No live Supabase project is configured.'
  const selected = collectionNames.filter((collectionName) => isRelevant(query, collectionName))
  if (!selected.length) return 'The visitor question does not require portfolio-specific context.'

  const { data, error } = await supabase
    .from('cms_records')
    .select('collection,data,enabled,published')
    .in('collection', selected)

  if (error) throw error

  const context = ((data ?? []) as CmsRow[]).filter((row) => {
    if (row.collection === 'projects') return row.published
    return row.enabled
  })
  const text = JSON.stringify(context.map(({ collection, data: record }) => ({ collection, data: record })))
  return text.length > 12000 ? text.slice(0, 12000) : text
}
