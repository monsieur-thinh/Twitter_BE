import express from 'express'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
// dotenv
import { config } from 'dotenv'
import { defaultErrorHandler } from '~/middlewares/error.middleware'
config() // Load environment variables from .env file

// Kết nối đến MongoDB
databaseService.connect()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json()) // Middleware để parse JSON body

app.use('/users', usersRouter)

// default error handler
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
