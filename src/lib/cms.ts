import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type CollectionReference,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable, type UploadTask } from 'firebase/storage'
import { db } from './firebase'
import { storage } from './firebase'

export type CmsRecord = DocumentData & { id: string }

function requireDb() {
  if (!db) throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* variables.')
  return db
}

export function subscribeToCollection(path: string, onData: (records: CmsRecord[]) => void, onError: (error: Error) => void): Unsubscribe {
  const reference = collection(requireDb(), path) as CollectionReference<DocumentData>
  return onSnapshot(query(reference, orderBy('order', 'asc')), (snapshot) => {
    onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
  }, onError)
}

export function subscribeToPublishedProjects(onData: (records: CmsRecord[]) => void, onError: (error: Error) => void): Unsubscribe {
  const reference = collection(requireDb(), 'projects') as CollectionReference<DocumentData>
  return onSnapshot(query(reference, where('published', '==', true)), (snapshot) => {
    const records = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as CmsRecord)
    onData(records.sort((a, b) => Number(a.order || 0) - Number(b.order || 0)))
  }, onError)
}

export async function createCmsRecord(path: string, data: DocumentData) {
  return addDoc(collection(requireDb(), path), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}

export async function updateCmsRecord(path: string, id: string, data: DocumentData) {
  return updateDoc(doc(requireDb(), path, id), { ...data, updatedAt: serverTimestamp() })
}

export async function replaceCmsDocument(path: string, data: DocumentData) {
  return setDoc(doc(requireDb(), path), { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

export async function deleteCmsRecord(path: string, id: string) {
  return deleteDoc(doc(requireDb(), path, id))
}

export function uploadProjectImage(file: File, projectId: string, onProgress: (progress: number) => void) {
  if (!storage) throw new Error('Firebase Storage is not configured.')
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) throw new Error('Only JPG, JPEG, PNG, and WebP images are supported.')
  if (file.size > 8 * 1024 * 1024) throw new Error('Each image must be smaller than 8 MB.')
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-')
  const task: UploadTask = uploadBytesResumable(ref(storage, `projects/${projectId}/${Date.now()}-${safeName}`), file, { contentType: file.type })
  return new Promise<string>((resolve, reject) => {
    task.on('state_changed', (snapshot) => onProgress(Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)), async () => {
      try { resolve(await getDownloadURL(task.snapshot.ref)) } catch (error) { reject(error) }
    }, reject)
  })
}

export async function deleteStoredImage(url: string) {
  if (!storage || !url) return
  await deleteObject(ref(storage, url))
}
