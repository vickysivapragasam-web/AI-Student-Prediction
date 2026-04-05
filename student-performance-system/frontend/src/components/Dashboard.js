import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Leaderboard from '../Leaderboard';
import { useAuth } from '../context/AuthContext';
import Alert from './common/Alert';
import EmptyState from './common/EmptyState';
import Spinner from './common/Spinner';
import StatCard from './common/StatCard';
import performanceService from '../services/performanceService';
import predictionService from '../services/predictionService';
import studentService from '../services/studentService';
import { getApiErrorMessage } from '../services/apiClient';
import { getRoleLabel, isAdminLikeRole } from '../utils/roles';

const Dashboard = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [students, setStudents] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAdminLike = isAdminLikeRole(user?.role);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        if (isAdminLike) {
          const [history, studentRecords] = await Promise.all([
            predictionService.getHistory(),
            studentService.listStudents(),
          ]);

          if (!isMounted) {
            return;
          }

          setPredictions(history);
          setStudents(studentRecords);
          setPerformances([]);
        } else {
          const [history, myPerformances] = await Promise.all([
            predictionService.getHistory(),
            performanceService.getMyPerformances(),
          ]);

          if (!isMounted) {
            return;
          }

          setPredictions(history);
          setPerformances(myPerformances);
          setStudents([]);
        }
      } catch (error) {
        if (isMounted) {
          setError(getApiErrorMessage(error, 'Unable to load the dashboard right now.'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [isAdminLike]);

  const recentPredictions = predictions.slice(0, 5);
  const averagePredictedScore = predictions.length
    ? (predictions.reduce((sum, item) => sum + item.predictedScore, 0) / predictions.length).toFixed(1)
    : '0.0';
  const highRiskCount = predictions.filter((item) => item.riskLevel === 'High Risk').length;
  const averageStudentScore = students.length
    ? (students.reduce((sum, item) => sum + item.totalScore, 0) / students.length).toFixed(1)
    : '0.0';

  return (
    <div className="content-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Portal Overview</p>
          <h1>{isAdminLike ? 'Admin Portal' : 'User Portal'}</h1>
          <p className="hero-copy">
            Welcome back, {user?.name}. Your {getRoleLabel(user?.role).toLowerCase()} workspace keeps the local
            prediction portal available, now backed by authentication, history tracking, and cleaner APIs.
          </p>
        </div>

        <div className="quick-actions">
          <Link className="button-primary" to={isAdminLike ? '/students/new' : '/predictor'}>
            {isAdminLike ? 'Add Student' : 'Run Prediction'}
          </Link>
          <Link className="button-secondary" to={isAdminLike ? '/students' : '/history'}>
            {isAdminLike ? 'Manage Records' : 'View History'}
          </Link>
        </div>
      </section>

      <Alert tone="error">{error}</Alert>

      {loading ? (
        <section className="panel">
          <Spinner label="Loading portal insights..." />
        </section>
      ) : (
        <>
          <section className="card-grid">
            {isAdminLike ? (
              <>
                <StatCard title="Student Records" value={students.length} caption="Active students available for admin management." />
                <StatCard title="Average Total Score" value={averageStudentScore} caption="Weighted score across stored student records." />
                <StatCard title="Predictions Logged" value={predictions.length} caption="Prediction history generated through the portal." />
                <StatCard title="High-Risk Students" value={highRiskCount} caption="Latest prediction entries currently marked as high risk." />
              </>
            ) : (
              <>
                <StatCard title="Predictions Made" value={predictions.length} caption="Predictions stored under your account." />
                <StatCard title="Average Predicted Score" value={averagePredictedScore} caption="Average score returned by the AI model." />
                <StatCard title="High-Risk Results" value={highRiskCount} caption="Prediction history items that need attention." />
                <StatCard title="Local Performance Logs" value={performances.length} caption="Local portal performance records preserved after login." />
              </>
            )}
          </section>

          <section className="two-column-layout">
            <div className="panel">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Recent Activity</p>
                  <h2>Prediction Timeline</h2>
                </div>
                <Link className="button-link" to="/history">
                  Open full history
                </Link>
              </div>

              {recentPredictions.length === 0 ? (
                <EmptyState
                  title="No predictions yet"
                  description="Run the predictor once and the portal will start building a prediction history for this account."
                />
              ) : (
                <div className="history-list">
                  {recentPredictions.map((prediction) => (
                    <article className="history-item" key={prediction._id}>
                      <div>
                        <h3>{prediction.student?.studentName || prediction.studentName || 'Manual prediction'}</h3>
                        <p>
                          {prediction.department || 'General'} • {prediction.yearOrSemester || 'Current term'}
                        </p>
                      </div>

                      <div className="history-meta">
                        <span className={`badge ${prediction.pass ? 'badge-success' : 'badge-danger'}`}>
                          {prediction.pass ? 'Pass' : 'Needs Attention'}
                        </span>
                        <strong>{Number(prediction.predictedScore).toFixed(1)}</strong>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <Leaderboard />
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
