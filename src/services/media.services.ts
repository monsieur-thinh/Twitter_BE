import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs'
import { UPLOAD_DIR } from '~/constants/dir'
import { getNameFromFullname, handleUploadSingleImage } from '~/utils/files'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
config()

class MediaService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameFromFullname(file.newFilename)
    const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
    await sharp(file.filepath).jpeg().toFile(newPath)
    fs.unlinkSync(file.filepath)

    return {
      uri: isProduction
        ? `${process.env.HOST}/static/${newName}.jpg`
        : `http://localhost:${process.env.PORT}/static/${newName}.jpg`,
      type: file.mimetype
    }
  }
}

const mediaService = new MediaService()

export default mediaService
