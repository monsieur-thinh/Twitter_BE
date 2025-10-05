import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { config } from 'dotenv'
import { TokenPayload } from '~/models/requests/Users.requests'
config() // Load environment variables from .env file

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET_KEY as string,
  options = { algorithm: 'HS256', expiresIn: '1d' }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: SignOptions
}): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    if (!privateKey) {
      return reject('JWT secret key is missing')
    }
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        return reject(`Error signing token: ${err.message}`)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET_KEY as string
}: {
  token: string
  secretOrPublicKey?: string
}) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    if (!secretOrPublicKey) {
      return reject('JWT secret key is missing')
    }
    // console.log('Token: ', secretOrPublicKey)
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) {
        return reject(`Error verifying token: ${err.message}`)
      }
      resolve(decoded as TokenPayload)
    })
  })
}
