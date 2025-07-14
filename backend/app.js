const express = require('express');
const cors = require('cors');
const app = express();

const rentfeeRouter = require('./routes/rentfee');
const roomRouter = require('./routes/room');
const pdfRouter = require('./routes/pdf');   // <--- 保留 PDF 路由
const electricityRouter = require('./routes/electricity');
const housesRouter = require('./routes/houses');
const joinRouter = require('./routes/room-join-tenant');






app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API 路由
app.use('/api/rentfee', rentfeeRouter);
app.use('/api/room', roomRouter);
app.use('/api/pdf', pdfRouter);     // <--- PDF 路由掛上來
app.use('/api/electricity', electricityRouter);
app.use('/api/houses', housesRouter);
app.use('/api/room-join-tenant', joinRouter);

// 404 處理
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// 全域錯誤處理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
