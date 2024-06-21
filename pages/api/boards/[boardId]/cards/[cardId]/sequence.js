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
  const { id: unusedPatchedCardId , sequence, columnId } = req.body;

  let updatedByTimeStamp = new Date();
  let updatedCardSeq = await pool.query('UPDATE cards SET sequence = $1, column_id = $2, updated_at = $3 WHERE id = $4 AND board_id = $5;', [sequence, columnId, updatedByTimeStamp, cardId, boardId]);

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