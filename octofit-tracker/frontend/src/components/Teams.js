import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Fetching teams from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams data received:', data);
        // Handle both paginated and plain array responses
        const teamsArray = data.results || data;
        console.log('Teams array:', teamsArray);
        setTeams(teamsArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
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
        <h2><span role="img" aria-label="teams">👥</span> Teams</h2>
        <button className="btn btn-primary">
          <span role="img" aria-label="add">➕</span> Create Team
        </button>
      </div>
      
      {teams.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No teams found. Create a team to get started!
        </div>
      ) : (
        <div className="row">
          {teams.map((team, index) => (
            <div className="col-md-6 col-lg-4 mb-4" key={team._id || team.id || index}>
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">
                    <span role="img" aria-label="team">👥</span> {team.name}
                  </h5>
                </div>
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-muted">Team Members</h6>
                  {team.members && team.members.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {team.members.map((member, memberIndex) => (
                        <span key={memberIndex} className="badge bg-primary">
                          {member.username || member}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No members yet</p>
                  )}
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-primary">
                      View Details
                    </button>
                    <button className="btn btn-sm btn-success">
                      Join Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="card mt-4">
        <div className="card-footer text-muted">
          Total Teams: {teams.length}
        </div>
      </div>
    </div>
  );
}

export default Teams;
