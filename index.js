const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const QQ_BASE = 'https://api.qqcatalyst.com';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Knowles & Co QQ Catalyst Proxy - Running');
});

app.get('/health', (req, res) => {
  res.send('OK');
});

app.all('/api/*', async (req, res) => {
  const path = req.path.replace('/api', '');
  const qs = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  const url = QQ_BASE + path + qs;
  try {
    const headers = {};
    if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
    const response = await fetch(url, {
      method: req.method,
      headers,
      body: ['POST','PUT','PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
    });
    const data = await response.text();
    res.status(response.status).set('Content-Type', 'application/json').send(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log('QQ Catalyst proxy running on port ' + PORT);
});
