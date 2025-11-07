import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use("/", router);



// 404 handler
app.use((_req, res) => {
	res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
	res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 4001;
const serviceName = process.env.SERVICE_NAME || 'Product-Service';

app.listen(port, () => {
	console.log(`${serviceName} is running on port ${port}`);
});