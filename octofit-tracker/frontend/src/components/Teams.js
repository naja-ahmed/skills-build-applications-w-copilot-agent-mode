import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

function Teams() {
  const [allTeams, setAllTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const [all, my] = await Promise.all([
        ApiService.getTeams(),
        ApiService.getMyTeams(),
      ]);
      setAllTeams(all.results || all);
      setMyTeams(my);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.createTeam(formData);
      setShowModal(false);
      setFormData({ name: '', description: '' });
      loadTeams();
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Failed to create team');
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      await ApiService.joinTeam(teamId);
      loadTeams();
    } catch (error) {
      console.error('Failed to join team:', error);
      alert('Failed to join team');
    }
  };

  const handleLeaveTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to leave this team?')) {
      try {
        await ApiService.leaveTeam(teamId);
        loadTeams();
      } catch (error) {
        console.error('Failed to leave team:', error);
        alert(error.message || 'Failed to leave team');
      }
    }
  };

  const isInTeam = (teamId) => {
    return myTeams.some(team => team.id === teamId);
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
          <h2>Teams</h2>
        </div>
        <div className="col text-end">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Create New Team
          </button>
        </div>
      </div>

      {/* My Teams */}
      <div className="mb-5">
        <h4 className="mb-3">My Teams</h4>
        {myTeams.length === 0 ? (
          <div className="alert alert-info">
            You haven't joined any teams yet. Join or create a team to get started!
          </div>
        ) : (
          <div className="row">
            {myTeams.map((team) => (
              <div key={team.id} className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{team.name}</h5>
                    <p className="card-text">{team.description}</p>
                    <div className="mb-2">
                      <small className="text-muted">
                        Captain: {team.captain?.username || 'Unknown'}
                      </small>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">
                        Members: {team.member_count || 0}
                      </small>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">
                        Total Points: {team.total_points || 0}
                      </small>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleLeaveTeam(team.id)}
                    >
                      Leave Team
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Teams */}
      <div>
        <h4 className="mb-3">All Teams</h4>
        <div className="row">
          {allTeams.map((team) => (
            <div key={team.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text">{team.description}</p>
                  <div className="mb-2">
                    <small className="text-muted">
                      Captain: {team.captain?.username || 'Unknown'}
                    </small>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">
                      Members: {team.member_count || 0}
                    </small>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">
                      Total Points: {team.total_points || 0}
                    </small>
                  </div>
                  {isInTeam(team.id) ? (
                    <button className="btn btn-secondary btn-sm" disabled>
                      Already Joined
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleJoinTeam(team.id)}
                    >
                      Join Team
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Team Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Team</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Team Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teams;
