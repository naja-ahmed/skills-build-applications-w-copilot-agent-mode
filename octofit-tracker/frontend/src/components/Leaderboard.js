import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

function Leaderboard() {
  const [period, setPeriod] = useState('weekly');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [period]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = period === 'weekly'
        ? await ApiService.getWeeklyLeaderboard()
        : await ApiService.getMonthlyLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h2>Leaderboard</h2>
        </div>
        <div className="col text-end">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${period === 'weekly' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setPeriod('weekly')}
            >
              Weekly
            </button>
            <button
              type="button"
              className={`btn ${period === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setPeriod('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">{period.charAt(0).toUpperCase() + period.slice(1)} Rankings</h5>
        </div>
        <div className="card-body">
          {leaderboard.length === 0 ? (
            <p className="text-center text-muted">No leaderboard data available yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Activities</th>
                    <th>Duration (min)</th>
                    <th>Distance (km)</th>
                    <th>Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>
                        <span className="fs-5">{getRankBadge(entry.rank || index + 1)}</span>
                      </td>
                      <td>
                        <strong>{entry.username || entry.user?.username}</strong>
                      </td>
                      <td>{entry.total_activities || 0}</td>
                      <td>{entry.total_duration || 0}</td>
                      <td>{entry.total_distance ? entry.total_distance.toFixed(2) : '0.00'}</td>
                      <td>{entry.total_calories || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 alert alert-info">
        <h6>How Rankings Work</h6>
        <p className="mb-0">
          Rankings are calculated based on total calories burned, with total duration as a tiebreaker.
          The leaderboard updates automatically as you and your friends log activities!
        </p>
      </div>
    </div>
  );
}

export default Leaderboard;
