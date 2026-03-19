import { useEffect, useMemo, useState } from 'react'
import './App.css'

import { shortenUrl, getAnalytics } from './lib/api'
import { HISTORY_KEY, HISTORY_LIMIT } from './lib/constants'
import { isProbablyUrl, buildShortUrl } from './lib/url'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { useInterval } from './hooks/useInterval'
import { Header } from './components/Header'
import { ShortenCard } from './components/ShortenCard'
import { HistoryCard } from './components/HistoryCard'

export default function App() {
  const [longUrl, setLongUrl] = useState('')
  const [customId, setCustomId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resultId, setResultId] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useLocalStorageState(HISTORY_KEY, [])
  const [analytics, setAnalytics] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsForId, setAnalyticsForId] = useState('')
  const [analyticsAutoRefresh, setAnalyticsAutoRefresh] = useState(true)
  const [lastAnalyticsUpdatedAt, setLastAnalyticsUpdatedAt] = useState(0)

  const shortUrl = useMemo(() => (resultId ? buildShortUrl(resultId) : ''), [resultId])

  useEffect(() => {
    // When a new short URL is generated, keep analytics target in sync.
    if (resultId) setAnalyticsForId(resultId)
  }, [resultId])

  async function onShorten(e) {
    e.preventDefault()
    setError('')
    setCopied(false)
    setAnalytics(null)

    const urlToSend = longUrl.trim()
    if (!urlToSend) return setError('Please paste a URL.')
    if (!isProbablyUrl(urlToSend)) return setError('That doesn’t look like a valid http/https URL.')

    setLoading(true)
    try {
      const id = await shortenUrl({ url: urlToSend, customId: customId.trim() })

      setResultId(id)
      setHistory((prev) => {
        const next = [{ id, longUrl: urlToSend, createdAt: Date.now() }, ...prev]
        const dedup = []
        const seen = new Set()
        for (const item of next) {
          const key = `${item.id}|${item.longUrl}`
          if (seen.has(key)) continue
          seen.add(key)
          dedup.push(item)
        }
        return dedup.slice(0, HISTORY_LIMIT)
      })
    } catch (err) {
      setError(err?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function onCopy() {
    if (!shortUrl) return
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setError('Copy failed. Please copy manually.')
    }
  }

  async function loadAnalytics(id) {
    setAnalytics(null)
    setError('')
    setAnalyticsForId(id)
    setAnalyticsLoading(true)
    try {
      setAnalytics(await getAnalytics(id))
      setLastAnalyticsUpdatedAt(Date.now())
    } catch (err) {
      setError(err?.message || 'Could not load analytics.')
    } finally {
      setAnalyticsLoading(false)
    }
  }

  async function loadAnalyticsFromHistory(id) {
    // Make the selected history item the "active" result so the analytics panel is visible.
    setResultId(id)
    await loadAnalytics(id)
  }

  useInterval(
    async () => {
      if (!analyticsForId) return
      if (!analyticsAutoRefresh) return
      if (analyticsLoading) return
      try {
        setAnalytics(await getAnalytics(analyticsForId))
        setLastAnalyticsUpdatedAt(Date.now())
      } catch {
        // don't spam errors while polling
      }
    },
    analytics && analyticsForId ? 2000 : null
  )

  function clearHistory() {
    setHistory([])
    setResultId('')
    setAnalytics(null)
    setAnalyticsForId('')
    setCopied(false)
    setError('')
  }

  return (
    <div className="page">
      <Header />

      <main className="main">
        <ShortenCard
          longUrl={longUrl}
          customId={customId}
          loading={loading}
          error={error}
          resultId={resultId}
          copied={copied}
          analytics={analytics}
          analyticsLoading={analyticsLoading}
          analyticsForId={analyticsForId}
          analyticsAutoRefresh={analyticsAutoRefresh}
          lastAnalyticsUpdatedAt={lastAnalyticsUpdatedAt}
          onLongUrlChange={setLongUrl}
          onCustomIdChange={setCustomId}
          onSubmit={onShorten}
          onCopy={onCopy}
          onLoadAnalytics={loadAnalytics}
          onToggleAnalyticsAutoRefresh={() => setAnalyticsAutoRefresh((v) => !v)}
        />

        <HistoryCard history={history} onClear={clearHistory} onLoadAnalytics={loadAnalyticsFromHistory} />
      </main>

      <footer className="footer">
        <span className="muted">
          Backend API: <span className="mono">{import.meta.env.DEV ? 'http://localhost:8001' : '/api'}</span>
        </span>
      </footer>
    </div>
  )
}
