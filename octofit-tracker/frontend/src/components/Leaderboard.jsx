import { useEffect, useState } from 'react';
import { extractRecords, getDisplayValue } from '../lib/api';

const leaderboardEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadLeaderboard() {
      try {
        const response = await fetch(leaderboardEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to load leaderboard (${response.status})`);
        }

        const body = await response.json();
        const records = extractRecords(body);

        if (isActive) {
          setEntries(records);
        }
      } catch (fetchError) {
        if (isActive) {
          setError(fetchError.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="octofit-view">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="view-title mb-1">Leaderboard</h2>
          <p className="text-secondary mb-0">Performance standings from the API.</p>
        </div>
        <span className="badge text-bg-primary">/api/leaderboard</span>
      </div>

      {loading ? <div className="octofit-panel">Loading leaderboard...</div> : null}
      {error ? <div className="octofit-panel text-danger">{error}</div> : null}

      {!loading && !error ? (
        <div className="row g-3">
          {entries.map((entry) => (
            <div className="col-12 col-md-6 col-xl-4" key={entry._id || entry.id || entry.rank}>
              <div className="octofit-panel h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="h5 mb-0">Rank {getDisplayValue(entry.rank)}</h3>
                  <span className="badge text-bg-success">{getDisplayValue(entry.points)} pts</span>
                </div>
                <p className="mb-0"><strong>User:</strong> {getDisplayValue(entry.userId)}</p>
              </div>
            </div>
          ))}
          {!entries.length ? <div className="octofit-panel">No leaderboard entries found.</div> : null}
        </div>
      ) : null}
    </section>
  );
}

export default Leaderboard;
