import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from './supabase'

type CmsRow = {
  id: string
  collection: string
  data: Record<string, unknown>
  sort_order: number
  published: boolean
  enabled: boolean
}

export type CmsRecord = Record<string, unknown> & { id: string }

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and a Supabase publishable key.')
  return supabase
}

function toCmsRecord(row: Pick<CmsRow, 'id' | 'data'>): CmsRecord {
  return { ...row.data, id: row.id }
}

function subscribeToRecords(
  collectionName: string,
  onData: (records: CmsRecord[]) => void,
  onError: (error: Error) => void,
  publishedOnly = false,
) {
  const client = requireSupabase()
  let active = true

  const loadRecords = async () => {
    let request = client
      .from('cms_records')
      .select('id,data')
      .eq('collection', collectionName)
      .order('sort_order', { ascending: true })

    if (publishedOnly) request = request.eq('published', true)

    const { data, error } = await request
    if (error) {
      if (active) onError(error)
      return
    }

    if (active) onData((data ?? []).map((row) => toCmsRecord(row as Pick<CmsRow, 'id' | 'data'>)))
  }

  const channel: RealtimeChannel = client
    .channel(`cms-${collectionName}-${crypto.randomUUID()}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'cms_records',
      filter: `collection=eq.${collectionName}`,
    }, () => {
      void loadRecords()
    })
    .subscribe((status, error) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        onError(error instanceof Error ? error : new Error(`Supabase Realtime subscription failed: ${status}`))
      }
    })

  void loadRecords()
  return () => {
    active = false
    void client.removeChannel(channel)
  }
}

export function subscribeToCollection(
  path: string,
  onData: (records: CmsRecord[]) => void,
  onError: (error: Error) => void,
) {
  return subscribeToRecords(path, onData, onError)
}

export function subscribeToPublishedProjects(
  onData: (records: CmsRecord[]) => void,
  onError: (error: Error) => void,
) {
  return subscribeToRecords('projects', onData, onError, true)
}

function toRow(collection: string, data: Record<string, unknown>) {
  return {
    id: crypto.randomUUID(),
    collection,
    data,
    sort_order: Number(data.order) || 0,
    published: data.published === true,
    enabled: data.enabled !== false,
  }
}

export async function createCmsRecord(path: string, data: Record<string, unknown>) {
  const { data: row, error } = await requireSupabase()
    .from('cms_records')
    .insert(toRow(path, data))
    .select('id')
    .single()

  if (error) throw error
  return row
}

export async function updateCmsRecord(path: string, id: string, data: Record<string, unknown>) {
  const { error } = await requireSupabase()
    .from('cms_records')
    .update({
      data,
      sort_order: Number(data.order) || 0,
      published: data.published === true,
      enabled: data.enabled !== false,
      updated_at: new Date().toISOString(),
    })
    .eq('collection', path)
    .eq('id', id)

  if (error) throw error
}

export async function deleteCmsRecord(path: string, id: string) {
  const { error } = await requireSupabase()
    .from('cms_records')
    .delete()
    .eq('collection', path)
    .eq('id', id)

  if (error) throw error
}

const imageBucket = 'project-images'

export async function uploadProjectImage(
  file: File,
  projectId: string,
  onProgress: (progress: number) => void,
) {
  const client = requireSupabase()
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) throw new Error('Only JPG, JPEG, PNG, and WebP images are supported.')
  if (file.size > 8 * 1024 * 1024) throw new Error('Each image must be smaller than 8 MB.')

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-')
  const path = `${projectId}/${crypto.randomUUID()}-${safeName}`
  onProgress(0)

  const { data, error } = await client.storage.from(imageBucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  })

  if (error) throw error
  onProgress(100)
  return client.storage.from(imageBucket).getPublicUrl(data.path).data.publicUrl
}

export async function deleteStoredImage(url: string) {
  if (!url) return

  const client = requireSupabase()
  const imageUrl = new URL(url)
  const bucketPath = `/storage/v1/object/public/${imageBucket}/`
  if (!imageUrl.pathname.includes(bucketPath)) return

  const path = decodeURIComponent(imageUrl.pathname.split(bucketPath)[1])
  const { error } = await client.storage.from(imageBucket).remove([path])
  if (error) throw error
}
