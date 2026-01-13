import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
    console.log('Fetching activities from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities data received:', data);
        // Handle both paginated and plain array responses
        const activitiesArray = data.results || data;
        console.log('Activities array:', activitiesArray);
        setActivities(activitiesArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
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
        <h2><span role="img" aria-label="activities">📊</span> Activities</h2>
        <button className="btn btn-primary">
          <span role="img" aria-label="add">➕</span> Add Activity
        </button>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Activity Log</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">User</th>
                  <th scope="col">Activity Type</th>
                  <th scope="col">Duration (min)</th>
                  <th scope="col">Date</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No activities found. Start tracking your fitness journey!
                    </td>
                  </tr>
                ) : (
                  activities.map((activity, index) => (
                    <tr key={activity._id || activity.id || index}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <span className="badge bg-secondary">
                          {activity.user?.username || activity.user}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {activity.activity_type}
                        </span>
                      </td>
                      <td>{activity.duration} min</td>
                      <td>{new Date(activity.date).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                        <button className="btn btn-sm btn-outline-danger">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer text-muted">
          Total Activities: {activities.length}
        </div>
      </div>
    </div>
  );
}

export default Activities;
