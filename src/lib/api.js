import { API_BASE } from './constants'

async function readJsonSafe(res) {
  try {
    return await res.json()
  } catch {
    return {}
  }
}

export async function shortenUrl({ url, customId }) {
  const res = await fetch(`${API_BASE}/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      customId: customId || undefined,
      shortId: customId || undefined,
    }),
  })

  const data = await readJsonSafe(res)
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`)
  if (!data?.id) throw new Error('Backend did not return an id.')
  return data.id
}

export async function getAnalytics(shortId) {
  const res = await fetch(`${API_BASE}/url/analytics/${shortId}`)
  const data = await readJsonSafe(res)
  if (!res.ok) throw new Error(data?.error || `Analytics failed (${res.status})`)
  return data
}
