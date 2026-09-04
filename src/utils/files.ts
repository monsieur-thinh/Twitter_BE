import { Request, Response } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { UPLOAD_DIR, UPLOAD_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, {
      recursive: true
    })
  }

  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true // mục đích để tạo folder nested
    })
  }
}

export const handleUploadSingleImage = async (req: Request): Promise<File> => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 4000 * 1024, //300kb,
    filter: ({ name, mimetype, originalFilename }) => {
      const isImageMimeType = Boolean(mimetype?.startsWith('image/'))
      const isImageExtension = Boolean(originalFilename?.match(/\.(png|jpe?g|gif|webp|bmp)$/i))
      const isAllowedFieldName = name === 'image' || name === 'file'
      const valid = isAllowedFieldName && (isImageMimeType || isImageExtension)

      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      const uploadedFiles = files.image ?? files.file

      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(uploadedFiles)) {
        return reject(new Error('File is emplty'))
      }
      resolve((uploadedFiles as File[])[0])
    })
  })
}

export const getNameFromFullname = (fullName: string) => {
  const namearr = fullName.split('.')
  namearr.pop()
  return namearr.join('')
}
