import { createHash } from 'crypto'
import { config } from 'dotenv'
config() // Load environment variables from .env file

export function sha256(content: string) {
  return createHash('sha256').update(content, 'utf8').digest('hex')
}

export function hashPassword(password: string): string {
  // Hash the password using SHA-256
  return sha256(password + process.env.SECRET_KEY)
}
