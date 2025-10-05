import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // run the validation
    await validation.run(req)
    // check for validation errors if there are no errors, call next()
    const errors = await validationResult(req)

    console.log('errors in validation: ' + errors)

    // if there are no errors, call next()
    if (errors.isEmpty()) {
      return next()
    }

    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })

    // if there are any errors, check if they are instances of ErrorWithStatus and their status is not 422 Unprocessable Entity
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      // Trả về lỗi không phải là lỗi do validate
      // nếu lỗi là ErrorWithStatus và status không phải là 422 Unprocessable Entity thì trả về lỗi đó
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = errorsObject[key]
    }
    // if there are errors, throw EntityError
    next(entityError)
  }
}
