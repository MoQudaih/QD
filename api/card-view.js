import { getDb, admin } from './_lib/firebase.js';

export const config = { runtime: 'nodejs', maxDuration: 10 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const id = String(body?.id || '').trim();
    if (!id) return res.status(400).json({ error: 'id is required' });

    const db = getDb();
    const ref = db.collection('cards').doc(id);
    await ref.set({
      views: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[card-view] failed:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
