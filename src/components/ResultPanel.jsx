import { buildShortUrl } from '../lib/url'

export function ResultPanel({
  resultId,
  copied,
  analytics,
  analyticsLoading,
  analyticsForId,
  analyticsAutoRefresh,
  lastAnalyticsUpdatedAt,
  onCopy,
  onLoadAnalytics,
  onToggleAnalyticsAutoRefresh,
}) {
  if (!resultId) return null

  const shortUrl = buildShortUrl(resultId)
  const showAuto = Boolean(analytics && analyticsForId === resultId)

  return (
    <div className="result">
      <div className="resultTop">
        <div>
          <div className="label">Your short link</div>
          <a className="shortLink" href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
        </div>
        <div className="resultActions">
          <button className="btn" type="button" onClick={onCopy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => onLoadAnalytics(resultId)}
            disabled={analyticsLoading}
          >
            {analyticsLoading ? 'Loading…' : 'Analytics'}
          </button>
        </div>
      </div>

      {analytics ? (
        <div className="analytics">
          <div className="stat">
            <div className="statNum">{analytics.totalClicks ?? 0}</div>
            <div className="statLabel">Total clicks</div>
            {showAuto ? (
              <div className="statLabel" style={{ marginTop: 8 }}>
                <button className="btn" type="button" onClick={onToggleAnalyticsAutoRefresh}>
                  Auto refresh: {analyticsAutoRefresh ? 'On' : 'Off'}
                </button>
                {lastAnalyticsUpdatedAt ? (
                  <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                    Updated: {new Date(lastAnalyticsUpdatedAt).toLocaleTimeString()}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="visits">
            <div className="visitsTitle">Recent visits</div>
            <div className="visitsList">
              {(analytics.Analytics || [])
                .slice(-10)
                .reverse()
                .map((v, idx) => (
                  <div className="visit" key={`${v.timestamp}-${idx}`}>
                    <span className="dot" aria-hidden="true" />
                    <span className="mono">{new Date(v.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              {(analytics.Analytics || []).length === 0 ? (
                <div className="muted">No visits yet.</div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

