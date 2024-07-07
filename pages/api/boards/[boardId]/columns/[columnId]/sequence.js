import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// update column sequence
handler.put(async (req, res) => {
  const { boardId, columnId } = req.query;
  const { sequence } = req.body;

  let updatedByTimeStamp = new Date();
  let updatedColumnSeq;
  
  updatedColumnSeq = await pool.query('UPDATE columns SET sequence = $1, updated_at = $2 WHERE id = $3 RETURNING *;', [sequence, updatedByTimeStamp, columnId]);
  
  if (updatedColumnSeq.rowCount === 0 || updatedColumnSeq === null) {
    throw new Error('Failed to update column.');
  }

  return res.status(200).json({
    status: "Success! Updated board.",
    data: {
      // column: updatedColumnSeq.rows[0]
    }
  });
});
export default handler;