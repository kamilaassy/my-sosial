import fs from 'fs'
import path from 'path'

export const handler = async (event) => {
  try {
    // Cek apakah request bukan multipart
    const contentType = event.headers['content-type'] || ''
    if (!contentType.includes('multipart/form-data')) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({ error: 'Wrong content type' }),
      }
    }

    // Redwood menyimpan raw body di rawBody (binary)
    const body = event.rawBody
    if (!body) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({ error: 'No rawBody received' }),
      }
    }

    // Simpan file langsung tanpa parsing (sementara)
    const filename = `upload-${Date.now()}.bin`
    const outDir = path.join(process.cwd(), 'api/public/uploads')

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

    const filePath = path.join(outDir, filename)

    await fs.promises.writeFile(filePath, body)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({ url: `/uploads/${filename}` }),
    }
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({ error: e.message }),
    }
  }
}
