import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

export const defaultErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | void => {
  // note: the return type is Response<any, Record<string, any>> | void
  if (err instanceof ErrorWithStatus) {
    // If the error is an instance of Error, we can log the message
    return res.status(err.status).json(omit(err, ['status']))
  }

  // If the error is not an instance of ErrorWithStatus, we can log the error message
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, {
      enumerable: true
    })
  })

  console.log('error in defaultErrHandler ' + err)
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: omit(err, ['stack'])
  })
}
