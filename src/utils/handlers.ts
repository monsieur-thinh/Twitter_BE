// import { Request, Response, NextFunction, RequestHandler } from 'express'

// export const wrapRequestHandler = (func: RequestHandler) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await func(req, res, next)
//     } catch (err) {
//       next(err)
//     }
//   }
// }

import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export const wrapRequestHandler = <P = ParamsDictionary>(
  func: (req: Request<P>, res: Response, next: NextFunction) => void | Promise<void>
) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}
