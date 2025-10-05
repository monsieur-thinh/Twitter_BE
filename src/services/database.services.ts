import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
config() // Load environment variables from .env file
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

const uri = `mongodb+srv://${username}:${password}@twitter.uhbeoww.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

class MongoDBClient {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    this.db = this.client.db(process.env.DB_NAME) // Hoặc tên database bạn muốn sử dụng
  }

  public async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err)
      throw err
    }
  }

  public async disconnect() {
    await this.client.close()
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_COLLECTION_USER as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_COLLECTION_REFRESH_TOKENS as string)
  }
}

// Tạo obj từ class MongoDBClient
const databaseService = new MongoDBClient()
export default databaseService
