export const HISTORY_KEY = 'url_shortener_history_v1'
export const HISTORY_LIMIT = 20

// In dev: empty string so Vite proxy handles `/url` and `/user`.
// In prod (Vercel): backend is exposed under `/api` using serverless functions.
export const API_BASE = import.meta.env.DEV ? '' : '/api'

// Used for building short links in dev only. In Vercel prod we use `/${shortId}`.
export const DEV_BACKEND_ORIGIN = 'http://localhost:8001'
