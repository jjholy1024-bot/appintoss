import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    name: 'socks-memorial-hall-backend',
    status: 'ok',
    time: new Date().toISOString(),
    endpoints: [
      '/api/generate-letter',
      '/api/shared-sock',
      '/api/tribute',
    ],
  });
}
