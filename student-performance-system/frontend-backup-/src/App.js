import React, { useState, useEffect } from "react";
import axios from "axios";
import Leaderboard from "./Leaderboard";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    examScore: 60,
    assignmentScore: 70,
    seminarScore: 65,
    projectScore: 75,
    sportsScore: 20,
    hackathonScore: 15,
    attendance: 85
  });
  const [result, setResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const predict = async () => {
    try {
      const res = await axios.post("http://localhost:5000/predict", form);
      setResult(res.data);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/leaderboard");
      setLeaderboard(res.data);
    } catch (error) {
      console.error("Leaderboard error:", error);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>🎓 Student Performance AI Predictor</h1>
        <p>Production-ready MERN + Python ML System</p>
      </header>

      <div className="container">
        <div className="predictor">
          <h2>🔮 AI Prediction</h2>
          
          {[
            { name: "examScore", label: "Exam Score (40-100)", max: 100 },
            { name: "assignmentScore", label: "Assignment Score (40-100)", max: 100 },
            { name: "seminarScore", label: "Seminar Score (30-100)", max: 100 },
            { name: "projectScore", label: "Project Score (40-100)", max: 100 },
            { name: "sportsScore", label: "Sports Score (0-50)", max: 50 },
            { name: "hackathonScore", label: "Hackathon Score (0-50)", max: 50 },
            { name: "attendance", label: "Attendance % (50-100)", max: 100 }
          ].map((field) => (
            <div key={field.name} className="input-group">
              <label>{field.label}</label>
              <input
                type="range"
                name={field.name}
                min={field.name.includes('Score') && field.name !== 'attendance' ? (field.name.includes('sports') || field.name.includes('hackathon') ? 0 : 30) : 0}
                max={field.max}
                value={form[field.name]}
                onChange={handleChange}
              />
              <span>{form[field.name]}</span>
            </div>
          ))}

          <button className="predict-btn" onClick={predict}>
            🚀 Predict Performance
          </button>

          {result && (
            <div className="result">
              <h3>📊 Predicted Results:</h3>
              <div className="score">Score: {result.predictedScore?.toFixed(1)} / 100</div>
              <div className={`status ${result.pass ? 'pass' : 'fail'}`}>
                {result.pass ? '✅ PASS' : '❌ FAIL'}
              </div>
            </div>
          )}
        </div>

        <Leaderboard data={leaderboard} refresh={loadLeaderboard} />
      </div>
    </div>
  );
}

export default App;
