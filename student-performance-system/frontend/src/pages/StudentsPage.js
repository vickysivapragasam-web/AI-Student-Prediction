import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/common/Alert';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import { getApiErrorMessage } from '../services/apiClient';
import predictionService from '../services/predictionService';
import studentService from '../services/studentService';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadStudents = async (searchTerm = '') => {
    setLoading(true);
    setError('');

    try {
      const response = await studentService.listStudents(searchTerm ? { search: searchTerm } : {});
      setStudents(response);
    } catch (error) {
      setError(getApiErrorMessage(error, 'Unable to load student records.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    await loadStudents(search);
  };

  const handleDelete = async (student) => {
    const confirmed = window.confirm(`Delete ${student.studentName}? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setError('');
    setMessage('');
    setSubmittingId(student._id);

    try {
      await studentService.deleteStudent(student._id);
      setMessage('Student record deleted successfully.');
      await loadStudents(search);
    } catch (error) {
      setError(getApiErrorMessage(error, 'Unable to delete the student record.'));
    } finally {
      setSubmittingId('');
    }
  };

  const handlePredict = async (student) => {
    setError('');
    setMessage('');
    setSubmittingId(student._id);

    try {
      const prediction = await predictionService.predictStudent(student._id);
      setMessage(
        `${student.studentName} predicted successfully with score ${Number(prediction.predictedScore).toFixed(1)} (${prediction.riskLevel}).`
      );
      await loadStudents(search);
    } catch (error) {
      setError(getApiErrorMessage(error, 'Unable to run prediction for this student.'));
    } finally {
      setSubmittingId('');
    }
  };

  return (
    <div className="content-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Admin Student Management</p>
          <h1>Student Records</h1>
          <p className="page-copy">
            Search, update, delete, and send manually entered student records through the prediction pipeline without
            leaving the portal.
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="toolbar">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              placeholder="Search by name, register number, or department"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button className="button-secondary button-compact" type="submit">
              Search
            </button>
          </form>

          <Link className="button-primary" to="/students/new">
            Add Student
          </Link>
        </div>
      </section>

      <Alert tone="success">{message}</Alert>
      <Alert tone="error">{error}</Alert>

      <section className="panel">
        {loading ? (
          <Spinner label="Loading student records..." />
        ) : students.length === 0 ? (
          <EmptyState
            title="No student records found"
            description="Add a new student manually to start building prediction-ready records for the admin portal."
          />
        ) : (
          <div className="table-shell">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Register No</th>
                  <th>Department</th>
                  <th>Semester / Year</th>
                  <th>Total Score</th>
                  <th>Last Prediction</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.studentName}</td>
                    <td>{student.registerNo}</td>
                    <td>{student.department}</td>
                    <td>{student.yearOrSemester}</td>
                    <td>{Number(student.totalScore).toFixed(1)}</td>
                    <td>{student.lastPrediction?.riskLevel || 'Not predicted yet'}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="button-secondary button-compact"
                          disabled={submittingId === student._id}
                          onClick={() => handlePredict(student)}
                          type="button"
                        >
                          {submittingId === student._id ? 'Predicting...' : 'Predict'}
                        </button>
                        <Link className="button-ghost button-compact" to={`/students/${student._id}/edit`}>
                          Edit
                        </Link>
                        <button
                          className="button-ghost button-compact"
                          disabled={submittingId === student._id}
                          onClick={() => handleDelete(student)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentsPage;
