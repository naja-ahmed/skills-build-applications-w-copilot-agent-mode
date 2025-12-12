import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    activity_type: 'running',
    duration: '',
    distance: '',
    calories: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [activitiesData, statsData] = await Promise.all([
        ApiService.getActivities(),
        ApiService.getActivityStats(),
      ]);
      setActivities(activitiesData.results || activitiesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
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
      await ApiService.createActivity(formData);
      setShowModal(false);
      setFormData({
        activity_type: 'running',
        duration: '',
        distance: '',
        calories: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });
      loadData();
    } catch (error) {
      console.error('Failed to create activity:', error);
      alert('Failed to log activity');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await ApiService.deleteActivity(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete activity:', error);
      }
    }
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
          <h2>Activity Dashboard</h2>
        </div>
        <div className="col text-end">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Log New Activity
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Total Activities</h5>
                <p className="card-text display-6">{stats.total_activities || 0}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Total Duration</h5>
                <p className="card-text display-6">{stats.total_duration || 0} min</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Total Distance</h5>
                <p className="card-text display-6">{stats.total_distance || 0} km</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Total Calories</h5>
                <p className="card-text display-6">{stats.total_calories || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="card">
        <div className="card-header">
          <h5>Recent Activities</h5>
        </div>
        <div className="card-body">
          {activities.length === 0 ? (
            <p className="text-center text-muted">No activities logged yet. Start by logging your first activity!</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Distance</th>
                    <th>Calories</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.date}</td>
                      <td className="text-capitalize">{activity.activity_type}</td>
                      <td>{activity.duration} min</td>
                      <td>{activity.distance ? `${activity.distance} km` : '-'}</td>
                      <td>{activity.calories || '-'}</td>
                      <td>{activity.notes || '-'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(activity.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Log New Activity</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Activity Type</label>
                    <select
                      className="form-select"
                      name="activity_type"
                      value={formData.activity_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="running">Running</option>
                      <option value="cycling">Cycling</option>
                      <option value="swimming">Swimming</option>
                      <option value="walking">Walking</option>
                      <option value="gym">Gym</option>
                      <option value="yoga">Yoga</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Distance (km)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="distance"
                      value={formData.distance}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Calories</label>
                    <input
                      type="number"
                      className="form-control"
                      name="calories"
                      value={formData.calories}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-control"
                      name="notes"
                      value={formData.notes}
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
                    Log Activity
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

export default Dashboard;
