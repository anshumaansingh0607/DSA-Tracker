import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

function StatsChart({ logs }) {
  // Group data by topic
  const topicMap = {};
  logs.forEach((log) => {
    if (!topicMap[log.topic]) topicMap[log.topic] = 0;
    topicMap[log.topic] += log.count;
  });

  const data = Object.entries(topicMap).map(([topic, total]) => ({
    topic,
    total,
  }));

  if (data.length === 0) return <p>No data to show in chart.</p>;

  return (
    <div style={{ width: '100%', height: 300, marginTop: '30px' }}>
      <h2>📊 Problems Solved per Topic</h2>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="topic" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatsChart;
