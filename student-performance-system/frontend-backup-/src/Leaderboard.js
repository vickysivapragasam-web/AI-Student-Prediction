import React from "react";

const Leaderboard = ({ data, refresh }) => {
  return (
    <div className="leaderboard">
      <h2>🏆 Top Performers</h2>
      <button onClick={refresh} className="refresh-btn">🔄 Refresh</button>
      
      {data.length === 0 ? (
        <p>No data available. Start adding performance records!</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Total Score</th>
                <th>Exam</th>
                <th>Project</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((student, index) => (
                <tr key={index}>
                  <td>{index + 1} 🥇</td>
                  <td>{student.totalScore?.toFixed(1)}</td>
                  <td>{student.examScore}</td>
                  <td>{student.projectScore}</td>
                  <td>{student.attendance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
