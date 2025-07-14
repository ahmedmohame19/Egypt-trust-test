import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { appRouter } from './src/app.router.js'
import { conn } from './DB/connection.js'

dotenv.config()
const app = express()

app.use(cors())
const port = process.env.PORT || 5000

// Connect to the database
conn()

appRouter(app, express)

app.listen(port, () => console.log(`Egypt trust test app listening on port ${port}!`))
