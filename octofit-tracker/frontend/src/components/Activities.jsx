import { useEffect, useState } from 'react';
import { extractRecords, getApiEndpoint, getDisplayValue } from '../lib/api';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadActivities() {
      try {
        const response = await fetch(getApiEndpoint('/api/activities/'));
        if (!response.ok) {
          throw new Error(`Failed to load activities (${response.status})`);
        }

        const body = await response.json();
        const records = extractRecords(body);

        if (isActive) {
          setActivities(records);
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

    loadActivities();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="octofit-view">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="view-title mb-1">Activities</h2>
          <p className="text-secondary mb-0">Recent workout activity feed.</p>
        </div>
        <span className="badge text-bg-primary">/api/activities</span>
      </div>

      {loading ? <div className="octofit-panel">Loading activities...</div> : null}
      {error ? <div className="octofit-panel text-danger">{error}</div> : null}

      {!loading && !error ? (
        <div className="row g-3">
          {activities.map((activity) => (
            <div className="col-12 col-lg-6" key={activity._id || activity.id || activity.type}>
              <div className="octofit-panel h-100">
                <h3 className="h5 mb-2">{getDisplayValue(activity.type)}</h3>
                <p className="mb-1"><strong>User:</strong> {getDisplayValue(activity.userId)}</p>
                <p className="mb-1"><strong>Duration:</strong> {getDisplayValue(activity.durationMinutes)} minutes</p>
                <p className="mb-1"><strong>Calories:</strong> {getDisplayValue(activity.caloriesBurned)}</p>
                <p className="mb-0 text-secondary"><strong>Occurred:</strong> {getDisplayValue(activity.occurredAt)}</p>
              </div>
            </div>
          ))}
          {!activities.length ? <div className="octofit-panel">No activities found.</div> : null}
        </div>
      ) : null}
    </section>
  );
}

export default Activities;
