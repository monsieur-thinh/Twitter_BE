import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
import { USERS_MESSAGES } from '~/constants/messages'
import mediaService from '~/services/media.services'

export const updloadSingerImageController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response
  // next: NextFunction
): Promise<void> => {
  const data = await mediaService.handleUploadSingleImage(req)
  res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: data
  })
}

export const serveImageController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_DIR, name))
}
