export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum Tokentype {
  AccessToken, // token truy cập, dùng để xác thực người dùng
  RefreshToken, // token làm mới, dùng để làm mới access token
  EmailVerifyToken, // token xác thực email
  ForgotPasswordToken // token quên mật khẩu
}
