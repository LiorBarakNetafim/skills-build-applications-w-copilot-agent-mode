import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Fetching workouts from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts data received:', data);
        // Handle both paginated and plain array responses
        const workoutsArray = data.results || data;
        console.log('Workouts array:', workoutsArray);
        setWorkouts(workoutsArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <h2><span role="img" aria-label="workouts">💪</span> Workouts</h2>
        <button className="btn btn-primary">
          <span role="img" aria-label="add">➕</span> Add Workout
        </button>
      </div>
      
      {workouts.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No workouts found. Add your first workout to get started!
        </div>
      ) : (
        <div className="row">
          {workouts.map((workout, index) => (
            <div className="col-md-6 col-lg-4 mb-4" key={workout._id || workout.id || index}>
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">
                    <span role="img" aria-label="workout">💪</span> {workout.name}
                  </h5>
                </div>
                <div className="card-body">
                  <p className="card-text">{workout.description || 'No description available'}</p>
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-primary">
                      View Details
                    </button>
                    <div>
                      <button className="btn btn-sm btn-outline-secondary me-1">
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="card mt-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Workout Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout, index) => (
                  <tr key={`table-${workout._id || workout.id || index}`}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <strong>{workout.name}</strong>
                    </td>
                    <td>{workout.description || 'No description'}</td>
                    <td>
                      <button className="btn btn-sm btn-success me-1">
                        Start
                      </button>
                      <button className="btn btn-sm btn-outline-primary">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer text-muted">
          Total Workouts: {workouts.length}
        </div>
      </div>
    </div>
  );
}

export default Workouts;
