import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { fileName, fileData, contentType } = req.body;
    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'Missing fileName or fileData' });
    }

    const buffer = Buffer.from(fileData.replace(/^data:.*;base64,/, ''), 'base64');
    const uniqueName = `${Date.now()}-${fileName}`;

    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueName,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const fileUrl = `${process.env.R2_PUBLIC_URL}/${uniqueName}`;

    return res.status(200).json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('R2 Upload error:', error);
    return res.status(500).json({ error: error.message });
  }
}