import { useState } from 'react';

function DSAForm({ onAdd }) {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic || count <= 0) return;
    onAdd({
      topic,
      count: parseInt(count),
      date: new Date().toISOString().split('T')[0],
    });
    setTopic('');
    setCount('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Enter DSA topic (e.g., DP)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Problems Solved"
        value={count}
        onChange={(e) => setCount(e.target.value)}
        required
      />
      <button type="submit">Add Practice</button>
    </form>
  );
}

export default DSAForm;
