import { NextFunction } from 'express'
import { pick } from 'lodash'

type filterKeys<T> = Array<keyof T>

export const filterMiddleware =
  <T>(filterKeys: filterKeys<T>) =>
  (req: any, res: any, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }
