import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import router from "./routes/index"
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use("/", router);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: 'internal server error' });
});

const port = process.env.PORT || 4003;
const serviceName = process.env.SERVICE_NAME || 'Auth-Service';

app.listen(port, () => {
  console.log(`${serviceName} is running on port ${port}`);
});
