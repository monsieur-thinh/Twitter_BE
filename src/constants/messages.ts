export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  // name
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be a string',
  NAME_LENGTH: 'Name must be between 3 and 50 characters',
  // mail
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_MUST_BE_VALID: 'Email must be a valid email address',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password is incorrect',
  // password
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be a string',
  PASSWORD_LENGTH: 'Password must be between 6 and 50 characters',
  PASSWORD_STRONG:
    'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.',
  // confirm password
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH: 'Confirm password must be between 6 and 50 characters',
  CONFIRM_PASSWORD_STRONG:
    'Confirm password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.',
  CONFIRM_PASSWORD_MUST_MATCH: 'Confirm password does not match password',
  // date of birth
  DATE_OF_BIRTH_IS_REQUIRED: 'Date of birth is required',
  DATE_OF_BIRTH_MUST_BE_ISO_DATE: 'Date of birth must be a valid ISO date string (YYYY-MM-DD)',
  // login
  LOGIN_SUCCESS: 'Login successful',
  LOGIN_FAILED: 'Login failed, please check your email and password',
  // register
  REGISTER_SUCCESS: 'Register successful',
  REGISTER_FAILED: 'Register failed, please try again',
  // access token
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  // refresh token
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_MUST_BE_STRING: 'Refresh token must be a string',
  REFRESH_TOKEN_INVALID: 'Refresh token is invalid or expired',
  REFRESH_TOKEN_TO_BE_USED_OR_DOES_NOT_EXIST: 'Refresh token is to be used or does not exist',
  // logout
  LOGOUT_SUCCESS: 'Logout successful',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email has already been verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verification successful',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email successful',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Please check your email to reset your password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password successful',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  // reset password
  RESET_PASSWORD_SUCCESS: 'reset password successful',
  // get me
  GET_ME_SUCCESS: 'get my infomation success',
  // verify
  USER_NOT_VERIFIED: 'User not verified',
  // update me
  BIO_MUST_BE_STRING: 'Bio must be a string',
  BIO_LENGTH: 'Bio must be between 1 and 200 characters',
  LOCATION_MUST_BE_STRING: 'Location must be a string',
  LOCATION_LENGTH: 'Location must be between 1 and 200 characters',
  WEBSITE_MUST_BE_STRING: 'Website must be a string',
  WEBSITE_LENGTH: 'Website must be between 1 and 200 characters',
  USERNAME_MUST_BE_STRING: 'username must be a string',
  USERNAME_LENGTH: 'username must be between 1 and 50 characters',
  IMAGE_URL_LENGTH: 'image url must be between 1 and 400 characters',
  IMAGE_URL_MUST_BE_STRING: 'image url must be a string',
  UPDATE_ME_SUCCESS: 'update profile success',
  // get user profile
  GET_USER_PROFILE_SUCCESS: 'get user profile success',
  // follow user
  FOLLOW_USER_SUCCESS: 'follow user success',
  INVALID_FOLLOWED_USER_ID: 'invalid followed user id',
  USER_ALREADY_FOLLOWED: 'user already followed'
} as const
