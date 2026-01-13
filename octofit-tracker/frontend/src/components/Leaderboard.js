import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Fetching leaderboard from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard data received:', data);
        // Handle both paginated and plain array responses
        const leaderboardArray = data.results || data;
        console.log('Leaderboard array:', leaderboardArray);
        setLeaderboard(leaderboardArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="badge bg-warning text-dark">🥇 1st</span>;
    if (rank === 2) return <span className="badge bg-secondary">🥈 2nd</span>;
    if (rank === 3) return <span className="badge bg-danger">🥉 3rd</span>;
    return <span className="badge bg-light text-dark">{rank}th</span>;
  };

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
      <div className="page-header">
        <h2><span role="img" aria-label="trophy">🏆</span> Leaderboard</h2>
      </div>
      
      <div className="card">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">🏆 Top Performers</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">User</th>
                  <th scope="col">Score</th>
                  <th scope="col">Progress</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No leaderboard entries yet. Start competing!
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry, index) => (
                    <tr key={entry._id || entry.id || index} className={index < 3 ? 'table-active' : ''}>
                      <td>{getRankBadge(index + 1)}</td>
                      <td>
                        <strong>{entry.user?.username || entry.user}</strong>
                      </td>
                      <td>
                        <span className="badge bg-success fs-6">{entry.score} pts</span>
                      </td>
                      <td style={{ width: '30%' }}>
                        <div className="progress" style={{ height: '20px' }}>
                          <div 
                            className="progress-bar bg-success" 
                            role="progressbar" 
                            style={{ width: `${Math.min((entry.score / (leaderboard[0]?.score || 1)) * 100, 100)}%` }}
                            aria-valuenow={entry.score}
                            aria-valuemin="0"
                            aria-valuemax={leaderboard[0]?.score || 100}
                          >
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer text-muted">
          Total Participants: {leaderboard.length}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
