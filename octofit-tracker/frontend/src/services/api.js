const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(username, password) {
    const data = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(data.key);
    return data;
  }

  async register(username, email, password1, password2) {
    const data = await this.request('/auth/registration/', {
      method: 'POST',
      body: JSON.stringify({ username, email, password1, password2 }),
    });
    this.setToken(data.key);
    return data;
  }

  async logout() {
    await this.request('/auth/logout/', { method: 'POST' });
    this.setToken(null);
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/profiles/me/');
  }

  async updateUserProfile(data) {
    return this.request('/profiles/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Activity endpoints
  async getActivities() {
    return this.request('/activities/');
  }

  async createActivity(data) {
    return this.request('/activities/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateActivity(id, data) {
    return this.request(`/activities/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteActivity(id) {
    return this.request(`/activities/${id}/`, {
      method: 'DELETE',
    });
  }

  async getActivityStats() {
    return this.request('/activities/stats/');
  }

  // Team endpoints
  async getTeams() {
    return this.request('/teams/');
  }

  async getMyTeams() {
    return this.request('/teams/my_teams/');
  }

  async createTeam(data) {
    return this.request('/teams/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async joinTeam(id) {
    return this.request(`/teams/${id}/join/`, {
      method: 'POST',
    });
  }

  async leaveTeam(id) {
    return this.request(`/teams/${id}/leave/`, {
      method: 'POST',
    });
  }

  // Leaderboard endpoints
  async getWeeklyLeaderboard() {
    return this.request('/leaderboards/weekly/');
  }

  async getMonthlyLeaderboard() {
    return this.request('/leaderboards/monthly/');
  }
}

export default new ApiService();
