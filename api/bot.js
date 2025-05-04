import { bot } from '../../lib/bot';
import { db } from '../../firebase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await bot.handleUpdate(req.body);
    res.status(200).json({ status: 'OK' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
