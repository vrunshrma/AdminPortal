// server.js
const express = require('express');
const path = require('path');

const app = express();
const buildPath = path.join(__dirname, 'build');

// Static files
app.use(express.static(buildPath));

// SPA fallback: sab routes ko index.html de do
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`React app running on http://localhost:${PORT}`);
});
