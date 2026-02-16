import { Router } from 'express'
import { updloadSingerImageController } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/handlers'
const mediaRouter = Router()

mediaRouter.post('/upload-image', wrapRequestHandler(updloadSingerImageController))

export default mediaRouter
