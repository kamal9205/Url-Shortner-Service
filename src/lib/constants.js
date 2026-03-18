export const HISTORY_KEY = 'url_shortener_history_v1'
export const HISTORY_LIMIT = 20

// In dev: empty string so Vite proxy handles /url and /user.
// In prod (Netlify): set VITE_API_ORIGIN to your backend origin (e.g. https://your-backend.onrender.com)
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || ''
export const API_BASE = API_ORIGIN

// Used to build redirect links (http(s)://<backend>/<shortId>)
export const BACKEND_ORIGIN = API_ORIGIN || 'http://localhost:8001'
