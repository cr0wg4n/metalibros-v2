import { randomUUID } from 'node:crypto'
import { extname, join } from 'node:path'
import { UnsupportedMediaTypeException } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function createImageUploadInterceptor(uploadsSubfolder: string) {
  return FileInterceptor('file', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', uploadsSubfolder),
      filename: (_req, file, callback) => callback(null, `${randomUUID()}${extname(file.originalname)}`),
    }),
    fileFilter: (_req, file, callback) => {
      if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
        callback(new UnsupportedMediaTypeException('Solo se aceptan imágenes JPEG, PNG o WEBP'), false)
        return
      }
      callback(null, true)
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  })
}
