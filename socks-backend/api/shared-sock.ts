import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const TTL_SECONDS = 60 * 60 * 24 * 60; // 공유 카드 보관 기간: 60일

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { id, sock } = (req.body || {}) as { id?: string; sock?: unknown };
    if (!id || !sock) {
      res.status(400).json({ error: 'id and sock are required' });
      return;
    }
    try {
      await redis.set(`sock:${id}`, sock, { ex: TTL_SECONDS });
      await redis.set(`tribute:${id}`, 0, { nx: true, ex: TTL_SECONDS });
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save shared sock' });
    }
    return;
  }

  if (req.method === 'GET') {
    const id = req.query.id as string | undefined;
    if (!id) {
      res.status(400).json({ error: 'id is required' });
      return;
    }
    try {
      const [sock, tributeCount] = await Promise.all([
        redis.get(`sock:${id}`),
        redis.get<number>(`tribute:${id}`),
      ]);
      if (!sock) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.status(200).json({ sock, tributeCount: tributeCount ?? 0 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch shared sock' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
