const express = require('express');
const path = require('path');
const app = express();

// Serve static files (css, js, components, etc.)
app.use('/components', express.static(path.join(__dirname, 'mental-wellnes', 'components')));
app.use('/css', express.static(path.join(__dirname, 'mental-wellnes', 'css')));
app.use('/js', express.static(path.join(__dirname, 'mental-wellnes', 'js')));
app.use(express.static(path.join(__dirname, 'mental-wellnes'))); // for index.html, manifest.json, images etc.

// Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'mental-wellnes', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


