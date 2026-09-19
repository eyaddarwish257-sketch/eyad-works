type FirestoreValue = { stringValue?: string; booleanValue?: boolean; integerValue?: string; doubleValue?: number; arrayValue?: { values?: FirestoreValue[] }; mapValue?: { fields?: Record<string, FirestoreValue> } }
type FirestoreDocument = { name?: string; fields?: Record<string, FirestoreValue> }

const projectId = process.env.VITE_FIREBASE_PROJECT_ID
const baseUrl = projectId ? `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents` : ''
const collectionNames = ['projects', 'skills', 'services', 'profile', 'about', 'hero', 'socialLinks', 'aiKnowledge']

function valueOf(value?: FirestoreValue): unknown {
  if (!value) return undefined
  if (value.stringValue !== undefined) return value.stringValue
  if (value.booleanValue !== undefined) return value.booleanValue
  if (value.integerValue !== undefined) return Number(value.integerValue)
  if (value.doubleValue !== undefined) return value.doubleValue
  if (value.arrayValue) return value.arrayValue.values?.map(valueOf) ?? []
  if (value.mapValue) return Object.fromEntries(Object.entries(value.mapValue.fields ?? {}).map(([key, item]) => [key, valueOf(item)]))
  return undefined
}

function documentOf(document: FirestoreDocument) {
  return Object.fromEntries(Object.entries(document.fields ?? {}).map(([key, value]) => [key, valueOf(value)]))
}

function isRelevant(query: string, collectionName: string) {
  const normalized = query.toLowerCase()
  const terms: Record<string, string[]> = {
    projects: ['project', 'built', 'work', 'website', 'app', 'مشروع', 'عمل'],
    skills: ['skill', 'technology', 'technologies', 'react', 'python', 'code', 'مهار', 'تقني'],
    services: ['service', 'build', 'offer', 'website', 'mobile', 'api', 'خدم', 'بناء'],
    profile: ['who', 'eyad', 'background', 'education', 'developer', 'من', 'إياد', 'دراسة'],
    about: ['who', 'eyad', 'about', 'background', 'من', 'إياد', 'نبذة'],
    hero: ['eyad', 'developer', 'does', 'من', 'مطور'],
    socialLinks: ['contact', 'email', 'github', 'linkedin', 'whatsapp', 'reach', 'تواصل', 'بريد'],
    aiKnowledge: ['eyad', 'portfolio', 'project', 'skill', 'service', 'about', 'contact', 'إياد', 'مشروع', 'مهار', 'خدم'],
  }
  return terms[collectionName]?.some((term) => normalized.includes(term)) ?? false
}

export async function retrievePortfolioContext(query: string) {
  if (!baseUrl) return 'No live Firestore project is configured.'
  const selected = collectionNames.filter((collectionName) => isRelevant(query, collectionName))
  if (!selected.length) return 'The visitor question does not require portfolio-specific context.'

  const documents = await Promise.all(selected.map(async (collectionName) => {
    const response = await fetch(`${baseUrl}/${collectionName}`)
    if (!response.ok) return []
    const payload = await response.json() as { documents?: FirestoreDocument[] }
    return (payload.documents ?? []).map((document) => ({ collection: collectionName, data: documentOf(document) }))
  }))

  const context = documents.flat().filter(({ collection, data }) => {
    if (collection === 'projects') return data.published === true
    if (['skills', 'services', 'hero', 'profile', 'about', 'socialLinks'].includes(collection)) return data.enabled !== false
    if (collection === 'aiKnowledge') return data.enabled === true
    return true
  })
  const text = JSON.stringify(context)
  return text.length > 12000 ? text.slice(0, 12000) : text
}
