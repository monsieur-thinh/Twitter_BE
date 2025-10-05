import { Router } from 'express'
// Import các controller cho người dùng
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  verifyEmailController,
  verifyForgotPasswordController,
  resendVerifyEmailController,
  resetPasswordController,
  getMeController,
  updateMeController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
// Import các middleware cho người dùng
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator,
  updateMeValidator
} from '~/middlewares/users.middlewares'
import { updateMeReqBody } from '~/models/requests/Users.requests'
import { wrapRequestHandler } from '~/utils/handlers'
const usersRouter = Router()
// Định nghĩa router cho các route liên quan đến người dùng

/**
 * Description: Route để đăng nhập người dùng
 * path: /users/login
 * method: POST
 * Body: {  email: string, password: string }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
/**
 * Description: Route để đăng xuất người dùng
 * path: /users/logout
 * method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 * Chưa hoàn thành, cần thêm logic để xử lý đăng xuất
 */
usersRouter.post(
  '/logout',
  accessTokenValidator, // Kiểm tra access token hợp lệ
  refreshTokenValidator, // Kiểm tra refresh token hợp lệ
  wrapRequestHandler(logoutController) // Chưa có controller cho logout, cần tạo
)
/**
 * Description: Route để đăng ký người dùng mới
 * path: /users/register
 * method: POST
 * Body: { name: string email: string, password: string, confirm_password: string date_of_birth: ISO8601 }
 */

usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController)) // có thể sử dụng validate() để validate registerValidator
/**
 * Description: Route để xác thực email người dùng
 * path: /users/email-verify
 * method: POST
 * Body: { email_verify_token: string }
 * status: Done
 */
usersRouter.post('/email-verify', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description: Route để gửi lại verify mail cho người dùng
 * path: /users/resend-verify-email
 * method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 * status: Done
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description: Route để gửi email quên mật khẩu
 * path: /users/forgot-password
 * method: POST
 * Body: { email: string }
 * status: Done
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Route used to verify link in email to reset password
 * path: /users/verify-forgot-password
 * method: POST
 * Body: { forgot-password-token: string }
 * status: Done
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Description: Route used to reset password
 * path: /users/reset-password
 * method: POST
 * Body: { forgot-password-token: string, password: string, confirm_password: string  }
 * status: Done
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description: Get my profile
 * path: /users/me
 * method: GET
 * Header: { Authorization: Bearer <access_token> }
 * status: Done
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Update my profile
 * path: /users/me
 * method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UserSchema
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<updateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

export default usersRouter
// Đoạn mã này định nghĩa một router cho các route liên quan đến người dùng trong ứng dụng Express.
