import { DEV_BACKEND_ORIGIN } from './constants'

export function isProbablyUrl(value) {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

// export function buildShortUrl(id) {
//   if (import.meta.env.DEV) return `${DEV_BACKEND_ORIGIN}/${id}`
//   if (typeof window !== 'undefined' && window.location?.origin) {
//     return `${window.location.origin}/${id}`
//   }
//   return `/${id}`
// }
export function buildShortUrl(id) {
  return `${import.meta.env.VITE_API_URL}/${id}`;
}