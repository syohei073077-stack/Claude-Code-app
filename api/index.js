import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import searchRouter from './routes/search.js';
import rakutenRouter from './routes/rakuten.js';

const app = express();

app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

app.use('/api/search', searchRouter);
app.use('/api/rakuten', rakutenRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
