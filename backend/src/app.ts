import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat';
const cors = require('cors'); 


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: 'http://localhost:3000', // 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));
app.use(express.json());


mongoose.connect(process.env.MONGODB_URL as string)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
