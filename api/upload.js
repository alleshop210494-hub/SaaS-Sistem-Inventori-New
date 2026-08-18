import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
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
    const { fileName, fileData } = req.body;

    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'Missing fileName or fileData' });
    }

    const uploadResponse = await imagekit.upload({
      file: fileData,
      fileName: `${Date.now()}-${fileName}`,
      folder: '/inventory',
    });

    return res.status(200).json({ 
      success: true, 
      url: uploadResponse.url,
      fileId: uploadResponse.fileId 
    });
  } catch (error) {
    console.error('ImageKit Upload error:', error);
    return res.status(500).json({ error: error.message });
  }
}