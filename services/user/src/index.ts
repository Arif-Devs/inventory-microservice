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
app.use("/", router)


//404 error
app.use((req, res)=>{
  res.status(404).json({message: 'Not found'})
})

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: 'internal server error' });
});

const port = process.env.PORT || 4004;
const serviceName = process.env.SERVICE_NAME || 'User-Service';

app.listen(port, () => {
  console.log(`${serviceName} is running on port ${port}`);
});
