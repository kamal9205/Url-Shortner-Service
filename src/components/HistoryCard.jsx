import { buildShortUrl } from '../lib/url'

export function HistoryCard({ history, onClear, onLoadAnalytics }) {
  return (
    <section className="card">
      <div className="cardHeader">
        <h2>History</h2>
        <div className="cardActions">
          <button className="btn danger" type="button" onClick={onClear} disabled={history.length === 0}>
            Clear
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="muted">No links yet.</div>
      ) : (
        <div className="history">
          {history.map((h) => {
            const s = buildShortUrl(h.id)
            return (
              <div className="historyItem" key={`${h.id}-${h.createdAt}`}>
                <div className="historyMain">
                  <a className="shortLink" href={s} target="_blank" rel="noreferrer">
                    {s}
                  </a>
                  <div className="historyLong" title={h.longUrl}>
                    {h.longUrl}
                  </div>
                </div>
                <div className="historyActions">
                  <button className="btn" type="button" onClick={() => onLoadAnalytics(h.id)}>
                    Analytics
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

