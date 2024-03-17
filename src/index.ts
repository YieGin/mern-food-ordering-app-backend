import express, { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import myUserRoute from './routes/myUserRoute'

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log('Connected to database!'));

const app = express()
const port = 7000

app.use(express.json())
app.use(cors())

app.get('/health', (req: Request, res: Response) => {
  res.send({ message: 'health OK!' })
})

app.use('/api/my/user', myUserRoute)
 
app.listen(port, () => {
  console.log(`Your server is running on ${port}`);
})