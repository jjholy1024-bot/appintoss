import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { id } = (req.body || {}) as { id?: string };
  if (!id) {
    res.status(400).json({ error: 'id is required' });
    return;
  }

  try {
    const exists = await redis.exists(`sock:${id}`);
    if (!exists) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    const tributeCount = await redis.incr(`tribute:${id}`);
    res.status(200).json({ tributeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add tribute' });
  }
}
