import { Tokentype, UserVerifyStatus } from './../constants/enums'
import { RegisterReqBody, updateMeReqBody } from '~/models/requests/Users.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { config } from 'dotenv'
import { SignOptions } from 'jsonwebtoken'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
config() // Load environment variables from .env file

class UsersService {
  private async signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '1d'
    return signToken({
      payload: {
        user_id,
        token_type: Tokentype.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: { expiresIn: accessTokenExpiresIn as SignOptions['expiresIn'] } // Thời gian hết hạn của Access Token
    })
  }

  private async signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '100d'
    return signToken({
      payload: {
        user_id,
        token_type: Tokentype.RefreshToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: { expiresIn: refreshTokenExpiresIn as SignOptions['expiresIn'] } // Thời gian hết hạn của Refresh Token
    })
  }

  private async signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const emailVerifyTokenExpiresIn = process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN || '1d'
    return signToken({
      payload: {
        user_id,
        token_type: Tokentype.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: { expiresIn: emailVerifyTokenExpiresIn as SignOptions['expiresIn'] } // Thời gian hết hạn của Access Token
    })
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const forgotPasswordTokenExpiresIn = process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN || '1d'
    return signToken({
      payload: {
        user_id,
        type: Tokentype.ForgotPasswordToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: { expiresIn: forgotPasswordTokenExpiresIn as SignOptions['expiresIn'] } // Thời gian hết hạn của Refresh Token
    })
  }

  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  async register(payload: RegisterReqBody) {
    console.log('Registering user with payload:', payload)
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth), // Chuyển đổi ngày sinh sang định dạng Date
        password: hashPassword(payload.password) // Mã hóa mật khẩu trước khi lưu
      })
    )
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refreshToken })
    ) // Lưu Refresh Token vào database
    console.log('email_verify_token: ' + email_verify_token)
    return {
      user_id,
      accessToken,
      refreshToken,
      email_verify_token
    }
  }

  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user) // Trả về true nếu email đã tồn tại, false nếu không tồn tại
    // if (user) {
    //   return true // Email đã tồn tại
    // } else {
    //   return false // Email không tồn tại
    // }
  }

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      user_id,
      verify
    })
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refreshToken })
    )
    return {
      accessToken,
      refreshToken
    }
  }

  async logout(refresh_token: string) {
    const result = await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    if (result.deletedCount === 0) {
      throw new Error('Refresh token not found')
    }
    return { message: USERS_MESSAGES.LOGOUT_SUCCESS }
  }

  async verifyEmail(user_id: string) {
    // Tạo giá trị cập nhập
    // MongoDB cập nhập giá trị
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }),
      databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
        {
          $set: {
            email_verify_token: '', // Xóa token xác thực email
            verify: UserVerifyStatus.Verified, // Đánh dấu người dùng đã xác thực email
            updated_at: '$$NOW' // Cập nhật thời gian cập nhật
          }
        }
      ])
    ])
    const [accessToken, refreshToken] = token
    return {
      accessToken,
      refreshToken
    }
  }

  // done
  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified })
    // giả bộ gửi email
    console.log('resend verify email: ', email_verify_token)

    // cập nhập lại giá trị email_verify_token trong document users
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    console.log('resend_email_token: ', email_verify_token)
    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
    }
  }

  // done
  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token,
          updated_at: '$$NOW'
        }
      }
    ])
    // gửi mail kèm đường link đến mail người dùng: https://twitter.com//forgot-password
    console.log('forgot_password_token: ', forgot_password_token)
    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword(user_id: string, password: string) {
    databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }

  async getMe(user_id: string) {
    const user = databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async updateMe(user_id: string, payload: updateMeReqBody) {
    const _payload = payload.date_of_birth
      ? {
          ...payload,
          date_of_birth: new Date(payload.date_of_birth)
        }
      : payload

    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(_payload as updateMeReqBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }
}

const usersService = new UsersService()
export default usersService
