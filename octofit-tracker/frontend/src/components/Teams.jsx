import { useEffect, useState } from 'react';
import { extractRecords, getDisplayValue } from '../lib/api';

const teamsEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadTeams() {
      try {
        const response = await fetch(teamsEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to load teams (${response.status})`);
        }

        const body = await response.json();
        const records = extractRecords(body);

        if (isActive) {
          setTeams(records);
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

    loadTeams();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="octofit-view">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="view-title mb-1">Teams</h2>
          <p className="text-secondary mb-0">Track squads and ownership.</p>
        </div>
        <span className="badge text-bg-primary">/api/teams</span>
      </div>

      {loading ? <div className="octofit-panel">Loading teams...</div> : null}
      {error ? <div className="octofit-panel text-danger">{error}</div> : null}

      {!loading && !error ? (
        <div className="row g-3">
          {teams.map((team) => (
            <div className="col-12 col-lg-6" key={team._id || team.id || team.name}>
              <div className="octofit-panel h-100">
                <h3 className="h5 mb-2">{getDisplayValue(team.name)}</h3>
                <p className="mb-1"><strong>Owner:</strong> {getDisplayValue(team.ownerId)}</p>
                <p className="mb-0"><strong>Members:</strong> {Array.isArray(team.memberIds) ? team.memberIds.length : 0}</p>
              </div>
            </div>
          ))}
          {!teams.length ? <div className="octofit-panel">No teams found.</div> : null}
        </div>
      ) : null}
    </section>
  );
}

export default Teams;
