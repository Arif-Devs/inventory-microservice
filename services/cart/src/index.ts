import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import './events/onKeyExpires';
import './queue/consumer';
import router from './routes/index';


dotenv.config();
const app = express();

// security middleware
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 100 requests per windowMs
  handler: (_req, res) => {
    res
      .status(429)
      .json({ message: 'Too many requests, please try again later.' });
  },
});
app.use(express.json());
app.use('/api', limiter);
app.use("/", router);
// request logger

app.use(morgan('dev'));


// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const port = process.env.PORT || 4006;
const serviceName = process.env.SERVICE_NAME || 'Cart-Service';

app.listen(port, () => {
  console.log(`${serviceName} is running on port ${port}`);
});
