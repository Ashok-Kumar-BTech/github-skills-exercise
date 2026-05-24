import { useEffect, useState } from 'react';
import { extractRecords, getDisplayValue } from '../lib/api';

const usersEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadUsers() {
      try {
        const response = await fetch(usersEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to load users (${response.status})`);
        }

        const body = await response.json();
        const records = extractRecords(body);

        if (isActive) {
          setUsers(records);
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

    loadUsers();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="octofit-view">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="view-title mb-1">Users</h2>
          <p className="text-secondary mb-0">Member profiles from the API.</p>
        </div>
        <span className="badge text-bg-primary">/api/users</span>
      </div>

      {loading ? <div className="octofit-panel">Loading users...</div> : null}
      {error ? <div className="octofit-panel text-danger">{error}</div> : null}

      {!loading && !error ? (
        <div className="row g-3">
          {users.map((user) => (
            <div className="col-12 col-md-6 col-xl-4" key={user._id || user.id || user.username}>
              <div className="octofit-panel h-100">
                <h3 className="h5 mb-2">{getDisplayValue(user.username || user.name || user.email)}</h3>
                <p className="mb-1"><strong>Email:</strong> {getDisplayValue(user.email)}</p>
                <p className="mb-0 text-secondary"><strong>ID:</strong> {getDisplayValue(user._id || user.id)}</p>
              </div>
            </div>
          ))}
          {!users.length ? <div className="octofit-panel">No users found.</div> : null}
        </div>
      ) : null}
    </section>
  );
}

export default Users;
