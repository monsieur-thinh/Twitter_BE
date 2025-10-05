import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  _id?: ObjectId // ID của Refresh Token
  user_id: ObjectId // ID của người dùng sở hữu Refresh Token
  token: string // Chuỗi Refresh Token
  created_at?: Date // Ngày tạo Refresh
}

class RefreshToken {
  _id?: ObjectId // ID của Refresh Token
  user_id: ObjectId // ID của người dùng sở hữu Refresh Token
  token: string // Chuỗi Refresh Token
  created_at: Date // Ngày tạo Refresh
  constructor({ _id, user_id, token, created_at }: RefreshTokenType) {
    this._id = _id
    this.user_id = user_id
    this.token = token
    this.created_at = created_at || new Date() // Nếu không có ngày tạo, sử dụng ngày hiện tại
  }
}

export default RefreshToken
