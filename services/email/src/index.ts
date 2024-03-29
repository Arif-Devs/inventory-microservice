import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { getEmails, sendEmail } from './controllers';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ health: 'ok' });
});

// app.use((req, res, next) => {
//   const allowedOrigins = ['http://localhost:8081', 'http://127.0.0.1:8081'];
//   const origin = req.headers.origin || '';

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     next();
//   } else {
//     res.status(403).json({ message: 'Forbidden' });
//   }
// });

//routes
app.post('/emails/send', sendEmail);
app.get('/emails', getEmails);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: 'internal server error' });
});

const port = process.env.PORT || 4005;
const serviceName = process.env.SERVICE_NAME || 'Email-Service';

app.listen(port, () => {
  console.log(`${serviceName} is running on port ${port}`);
});
