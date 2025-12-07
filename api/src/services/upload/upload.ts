import fs from 'fs'
import path from 'path'

import type { MutationResolvers } from 'types/graphql'

export const uploadAvatar: MutationResolvers['uploadAvatar'] = async ({
  file,
}) => {
  const { createReadStream, filename } = await file

  const ext = filename.split('.').pop()
  const newName = `avatar-${Date.now()}.${ext}`

  const uploadDir = path.join(process.cwd(), 'api/public/avatars')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const filePath = path.join(uploadDir, newName)

  return new Promise((resolve, reject) => {
    createReadStream()
      .pipe(fs.createWriteStream(filePath))
      .on('finish', () => resolve({ url: `/avatars/${newName}` }))
      .on('error', (err) => reject(err))
  })
}
