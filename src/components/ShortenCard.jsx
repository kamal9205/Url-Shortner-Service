import { ResultPanel } from './ResultPanel'

export function ShortenCard({
  longUrl,
  customId,
  loading,
  error,
  resultId,
  copied,
  analytics,
  analyticsLoading,
  analyticsForId,
  analyticsAutoRefresh,
  lastAnalyticsUpdatedAt,
  onLongUrlChange,
  onCustomIdChange,
  onSubmit,
  onCopy,
  onLoadAnalytics,
  onToggleAnalyticsAutoRefresh,
}) {
  return (
    <section className="card">
      <h1>Shorten a long URL</h1>
      <p className="muted">Paste a link, generate a short one, then track clicks.</p>

      <form className="form" onSubmit={onSubmit}>
        <label className="field">
          <span>Long URL</span>
          <input
            value={longUrl}
            onChange={(e) => onLongUrlChange(e.target.value)}
            placeholder="https://example.com/some/very/long/url"
            inputMode="url"
            autoComplete="off"
          />
        </label>

        <div className="row">
          <label className="field">
            <span>Custom ID (optional)</span>
            <input
              value={customId}
              onChange={(e) => onCustomIdChange(e.target.value)}
              placeholder="my-link"
              autoComplete="off"
            />
          </label>

          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Shortening…' : 'Shorten'}
          </button>
        </div>
      </form>

      {error ? <div className="alert">{error}</div> : null}

      <ResultPanel
        resultId={resultId}
        copied={copied}
        analytics={analytics}
        analyticsLoading={analyticsLoading}
        analyticsForId={analyticsForId}
        analyticsAutoRefresh={analyticsAutoRefresh}
        lastAnalyticsUpdatedAt={lastAnalyticsUpdatedAt}
        onCopy={onCopy}
        onLoadAnalytics={onLoadAnalytics}
        onToggleAnalyticsAutoRefresh={onToggleAnalyticsAutoRefresh}
      />
    </section>
  )
}

