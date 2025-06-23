import { useState, useEffect } from 'react';
import DSAForm from './components/DSAForm';
import StatsChart from './components/StatsChart';
import './App.css';
function App() {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('dsaLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [filterTopic, setFilterTopic] = useState('All');
  const [dailyGoal, setDailyGoal] = useState(5);
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    localStorage.setItem('dsaLogs', JSON.stringify(logs));
  }, [logs]);

  const addLog = (entry) => {
    setLogs([entry, ...logs]);
  };

  const deleteLog = (indexToDelete) => {
    const updated = logs.filter((_, i) => i !== indexToDelete);
    setLogs(updated);
  };

  const clearLogs = () => {
    if (window.confirm("Clear all DSA logs?")) {
      setLogs([]);
    }
  };

  const uniqueTopics = ['All', ...new Set(logs.map((log) => log.topic))];
  const filteredLogs =
    filterTopic === 'All'
      ? logs
      : logs.filter((log) => log.topic === filterTopic);

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortDesc) {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  const currentStreak = calculateStreak(logs);

  const today = new Date().toISOString().split('T')[0];
  const todayCount = logs
    .filter((log) => log.date === today)
    .reduce((sum, log) => sum + Number(log.count), 0);

  function calculateStreak(logs) {
    const dateSet = new Set(logs.map((log) => log.date));
    let streak = 0;
    let currentDate = new Date();

    while (true) {
      const formattedDate = currentDate.toISOString().split('T')[0];
      if (dateSet.has(formattedDate)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🧠 DSA Practice Tracker</h1>
        <h3>🔥 Streak: {currentStreak} {currentStreak === 1 ? 'day' : 'days'}</h3>
      </header>

      <section className="goal-section">
        <h2>🎯 Daily Goal</h2>
        <input
          type="number"
          value={dailyGoal}
          onChange={(e) => setDailyGoal(Number(e.target.value))}
          min="1"
        />
        <p>
          ✅ Today: {todayCount}/{dailyGoal} problems
        </p>
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${Math.min((todayCount / dailyGoal) * 100, 100)}%`,
            }}
          ></div>
        </div>
      </section>

      <section className="form-section">
        <DSAForm onAdd={addLog} />
      </section>

      {uniqueTopics.length > 1 && (
        <section className="filter-section">
          <label>Filter by topic:</label>
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
          >
            {uniqueTopics.map((topic, i) => (
              <option key={i} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </section>
      )}

      <section className="log-section">
        <h2>📋 Practice Log</h2>

        <button className="sort-toggle" onClick={() => setSortDesc(!sortDesc)}>
          {sortDesc ? '⬇️ Show Oldest First' : '⬆️ Show Newest First'}
        </button>

        {sortedLogs.length === 0 ? (
          <p className="empty-text">No entries to display.</p>
        ) : (
          <ul className="log-list">
            {sortedLogs.map((entry, index) => (
              <li key={index} className="log-card">
                <div>
                  <strong>{entry.date}</strong> — {entry.topic} — {entry.count} problems
                </div>
                <button onClick={() => deleteLog(index)}>❌</button>
              </li>
            ))}
          </ul>
        )}

        {logs.length > 0 && (
          <button className="clear-button" onClick={clearLogs}>
            🧹 Clear All Logs
          </button>
        )}
      </section>

      <section className="chart-section">
        <StatsChart logs={logs} />
      </section>
    </div>
  );
}

export default App;
