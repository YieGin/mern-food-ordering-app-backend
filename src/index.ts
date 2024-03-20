import express, { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose' 
import myUserRoute from './routes/myUserRoute'
import myRestaurantRoute from './routes/MyRestaurantRoute'
import { v2 as cloudinary } from 'cloudinary'

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log('Connected to database!'));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express()
const port = 7000

app.use(express.json())
app.use(cors())

app.get('/health', (req: Request, res: Response) => {
  res.send({ message: 'health OK!' })
})

app.use('/api/my/user', myUserRoute);
app.use('/api/my/restaurant', myRestaurantRoute);
 
app.listen(port, () => {
  console.log(`Your server is running on ${port}`);
})