import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRoleLabel, isAdminLikeRole } from '../../utils/roles';

const LEGACY_PORTAL_URL = 'https://student-insight-hub-alpha.vercel.app/';

const pageDescriptions = {
  '/admin': 'Monitor student records, predictions, and administrative actions.',
  '/dashboard': 'Track your local portal activity and leaderboard insights.',
  '/predictor': 'Run the student prediction model with the updated API flow.',
  '/history': 'Review saved prediction results and previous activity.',
  '/students': 'Search, edit, delete, and predict stored student records.',
  '/students/new': 'Add a new student record manually for prediction and tracking.',
};

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLike = isAdminLikeRole(user?.role);

  const navigationItems = [
    {
      label: 'Overview',
      to: isAdminLike ? '/admin' : '/dashboard',
    },
    {
      label: 'Predictor',
      to: '/predictor',
    },
    {
      label: 'Prediction History',
      to: '/history',
    },
    {
      label: 'Legacy Portal',
      to: LEGACY_PORTAL_URL,
      external: true,
    },
    ...(isAdminLike
      ? [
          {
            label: 'Students',
            to: '/students',
          },
          {
            label: 'Add Student',
            to: '/students/new',
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand-block">
          <div className="brand-mark">SP</div>
          <div className="brand-copy">
            <h1>Student Prediction</h1>
            <p>Auth, analytics, and the AI predictor in one local portal.</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            item.external ? (
              <a className="nav-link" href={item.to} key={item.label}>
                {item.label}
              </a>
            ) : (
              <NavLink className="nav-link" key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            )
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <strong>{user?.name}</strong>
            <p>{user?.email}</p>
            <p>{getRoleLabel(user?.role)} access</p>
          </div>

          <button className="button-secondary" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-card">
            <div>
              <h2>Student Prediction System</h2>
              <p>{pageDescriptions[location.pathname] || 'Use the navigation to continue through the local portal.'}</p>
            </div>
            <div className="role-pill">{getRoleLabel(user?.role)} Session</div>
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
