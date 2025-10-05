import { ObjectId } from 'mongodb'

interface FollowerType {
  _id?: ObjectId // ID của Follower
  user_id: ObjectId // ID của người dùng
  followed_user_id: ObjectId // ID của người dùng được theo dõi
  created_at?: Date // Ngày tạo Follower
}

class Follower {
  _id?: ObjectId // ID của Refresh Token
  user_id: ObjectId // ID của người dùng sở hữu Refresh Token
  followed_user_id: ObjectId // ID của người dùng được theo dõi
  created_at: Date // Ngày tạo Refresh
  constructor({ _id, user_id, followed_user_id, created_at }: FollowerType) {
    this._id = _id
    this.user_id = user_id
    this.followed_user_id = followed_user_id
    this.created_at = created_at || new Date() // Nếu không có ngày tạo, sử dụng ngày hiện tại
  }
}

export default Follower
