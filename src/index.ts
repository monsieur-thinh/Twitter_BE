import express, { ErrorRequestHandler } from 'express'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
// dotenv
import { config } from 'dotenv'
import { defaultErrorHandler } from '~/middlewares/error.middleware'
import mediaRouter from '~/routes/medias.routes'
import { initFolder } from '~/utils/files'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
import staticRouter from '~/routes/static.routes'
import argv from 'minimist'

// const option = argv(process.argv.slice(2))

config() // Load environment variables from .env file

// Kết nối đến MongoDB
databaseService.connect()

const app = express()
const port = process.env.PORT || 5000

// const options = argv(process.argv.slice(2))
// console.log(options)

console.log(process.argv)

// tạo foldere upload
initFolder()

app.use(express.json()) // Middleware để parse JSON body

app.use('/users', usersRouter)
app.use('/medias', mediaRouter)
app.use('/static', express.static(UPLOAD_DIR))
// app.use('/static', staticRouter)

// default error handler
app.use(defaultErrorHandler as unknown as ErrorRequestHandler)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
