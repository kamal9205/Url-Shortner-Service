import { BACKEND_ORIGIN } from './constants'

export function isProbablyUrl(value) {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function buildShortUrl(id) {
  return `${BACKEND_ORIGIN}/${id}`
}
