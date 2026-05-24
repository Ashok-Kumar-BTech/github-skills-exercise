import { useEffect, useState } from 'react';
import { extractRecords, getDisplayValue } from '../lib/api';

const workoutsEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadWorkouts() {
      try {
        const response = await fetch(workoutsEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to load workouts (${response.status})`);
        }

        const body = await response.json();
        const records = extractRecords(body);

        if (isActive) {
          setWorkouts(records);
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

    loadWorkouts();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="octofit-view">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="view-title mb-1">Workouts</h2>
          <p className="text-secondary mb-0">Suggested workout plans from the API.</p>
        </div>
        <span className="badge text-bg-primary">/api/workouts</span>
      </div>

      {loading ? <div className="octofit-panel">Loading workouts...</div> : null}
      {error ? <div className="octofit-panel text-danger">{error}</div> : null}

      {!loading && !error ? (
        <div className="row g-3">
          {workouts.map((workout) => (
            <div className="col-12 col-lg-6" key={workout._id || workout.id || workout.title}>
              <div className="octofit-panel h-100">
                <h3 className="h5 mb-2">{getDisplayValue(workout.title)}</h3>
                <p className="mb-1"><strong>Difficulty:</strong> {getDisplayValue(workout.difficulty)}</p>
                <p className="mb-1"><strong>User:</strong> {getDisplayValue(workout.userId)}</p>
                <p className="mb-2"><strong>Exercises:</strong></p>
                <ul className="mb-0">
                  {Array.isArray(workout.exercises)
                    ? workout.exercises.map((exercise) => <li key={exercise}>{getDisplayValue(exercise)}</li>)
                    : null}
                </ul>
              </div>
            </div>
          ))}
          {!workouts.length ? <div className="octofit-panel">No workouts found.</div> : null}
        </div>
      ) : null}
    </section>
  );
}

export default Workouts;
