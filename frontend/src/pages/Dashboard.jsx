import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const handleActivateFree = async () => {
    setLoading(true);
    try {
      const res = await API.post('/payment/free-plan');
      console.log('Free plan response:', res.data);
      await fetchUser();
    } catch (err) {
      console.log('Free plan error:', err.response?.data);
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (plan) => {
    if (plan === 'pro') return '#7c3aed';
    if (plan === 'basic') return '#2563eb';
    return '#059669';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!user) return <div className="loading">Loading...</div>;

  const subscription = user?.subscription;
  const isActive = subscription?.isActive === true;
  const plan = subscription?.plan;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p>Here's your account overview</p>
      </div>

      <div className="dashboard-grid">

        {/* Profile Card */}
        <div className="dashboard-card">
          <div className="card-title">👤 Profile</div>
          <div className="card-info">
            <div className="info-row">
              <span className="info-label">Name</span>
              <span className="info-value">{user?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="dashboard-card">
          <div className="card-title">💳 Subscription</div>
          {isActive ? (
            <div className="card-info">
              <div className="info-row">
                <span className="info-label">Current Plan</span>
                <span
                  className="plan-badge"
                  style={{ background: getPlanColor(plan) }}
                >
                  {plan?.toUpperCase()}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Started</span>
                <span className="info-value">
                  {formatDate(subscription?.startDate)}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Expires</span>
                <span className="info-value">
                  {formatDate(subscription?.endDate)}
                </span>
              </div>
              <Link to="/pricing" className="btn-upgrade">
                Upgrade Plan ⚡
              </Link>
            </div>
          ) : (
            <div className="no-plan">
              <p>You don't have an active plan yet!</p>
              <button
                onClick={handleActivateFree}
                className="btn-free"
                disabled={loading}
              >
                {loading ? 'Activating...' : 'Activate Free Plan'}
              </button>
              <Link to="/pricing" className="btn-upgrade">
                See All Plans
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links Card */}
        <div className="dashboard-card">
          <div className="card-title">🚀 Quick Links</div>
          <div className="quick-links">
            <Link to="/pricing" className="quick-link">
              💰 View Pricing Plans
            </Link>
            <div className="quick-link">
              📊 Payment History — Coming Soon
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;