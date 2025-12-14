import { v2 as cloudinary } from 'cloudinary'

console.log('CLOUDINARY ENV CHECK:', {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET ? 'OK' : 'MISSING',
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export const uploadPostImageBuffer = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'my_social/posts',
        quality: 'auto',
        fetch_format: 'auto',
        width: 1500,
        crop: 'limit',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result!.secure_url)
      }
    )

    stream.end(buffer)
  })
}

export const uploadAvatarBuffer = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'my_social/avatars',

        width: 256,
        height: 256,
        crop: 'fill',
        gravity: 'face', // auto center ke wajah

        quality: 'auto',
        fetch_format: 'auto',

        transformation: [
          { radius: 'max' }, // biar bulat
        ],
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result!.secure_url)
      }
    )

    stream.end(buffer)
  })
}
