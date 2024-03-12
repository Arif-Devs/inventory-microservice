import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { createProduct, getProducts, getProductDetails } from './controllers';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ health: 'ok' });
});
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:8081', 'http://127.0.0.1:8081'];
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});
//routes
app.get('/products/:id', getProductDetails);
//app.put('/products/:id', updateProduct);
app.get('/products', getProducts);
app.post('/products', createProduct);
app.use((req, res) => {
  res.status(404).json({ message: 'not found' });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: 'internal server error' });
});

const port = process.env.PORT || 4001;
const serviceName = process.env.SERVICE_NAME || 'product-Service';

app.listen(port, () => {
  console.log(`${serviceName} is running on port ${port}`);
});
