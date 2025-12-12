import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold mb-4">Welcome to OctoFit Tracker</h1>
          <p className="lead mb-4">
            Track your fitness journey, compete with friends, and achieve your goals together!
          </p>
          <div className="mb-4">
            <h5>Features:</h5>
            <ul className="list-unstyled">
              <li>✅ Log and track your workouts</li>
              <li>✅ Create and join fitness teams</li>
              <li>✅ Compete on leaderboards</li>
              <li>✅ Monitor your progress with stats</li>
            </ul>
          </div>
          {!isAuthenticated && (
            <div>
              <Link to="/register" className="btn btn-primary btn-lg me-2">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline-primary btn-lg">
                Login
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard
            </Link>
          )}
        </div>
        <div className="col-lg-6 text-center">
          <img
            src="/octofitapp-small.png"
            alt="OctoFit Tracker"
            className="img-fluid rounded shadow"
            style={{ maxWidth: '400px' }}
          />
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-4 text-center mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="mb-3">📊</h3>
              <h5 className="card-title">Track Activities</h5>
              <p className="card-text">
                Log your workouts including running, cycling, gym sessions, and more.
                Monitor duration, distance, and calories burned.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 text-center mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="mb-3">👥</h3>
              <h5 className="card-title">Join Teams</h5>
              <p className="card-text">
                Create or join fitness teams with your friends and colleagues.
                Work together towards common fitness goals.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 text-center mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="mb-3">🏆</h3>
              <h5 className="card-title">Compete & Win</h5>
              <p className="card-text">
                Climb the leaderboards with weekly and monthly rankings.
                Stay motivated through friendly competition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
