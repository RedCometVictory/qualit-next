import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// update card sequence for column & board
handler.put(async (req, res) => {
  // const { id } = req.user;
  const { boardId, cardId } = req.query;
  const { sequence } = req.body;

  let updatedByTimeStamp = new Date();
  let updatedCardSeq = await pool.query('UPDATE cards SET sequence = $1, updated_at = $2 WHERE id = $3 AND board_id = $4;', [sequence, updatedByTimeStamp, cardId, boardId]);

  if (updatedCardSeq.rowCount === 0 || updatedCardSeq === null) {
    throw new Error('Failed to update card.');
  }
  return res.status(201).json({
    status: "Success! Updated card.",
    data: {
      card: updatedCardSeq.rows[0]
    }
  });
});
export default handler;