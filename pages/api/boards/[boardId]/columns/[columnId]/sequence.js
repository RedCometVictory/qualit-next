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
// TODO: apply sequence to column to reflect change
handler.put(async (req, res) => {
  const { boardId, columnId } = req.query;
  // const { id, sequence } = req.body;
  const { sequence } = req.body;

  console.log("()()()()()()()()()")
  console.log("req.query")
  console.log(req.query)
  console.log("()()()()()()()()()")
  console.log("req.body")
  console.log(req.body)
  console.log("()()()()()()()()()")
  //! TODO: Check if there is a name, then update if there is a change, else skip the name update

  let updatedByTimeStamp = new Date();
  let updatedColumnSeq;
  
  updatedColumnSeq = await pool.query('UPDATE columns SET sequence = $1, updated_at = $2 WHERE id = $3 RETURNING *;', [sequence, updatedByTimeStamp, columnId]);
  // updatedColumnSeq = await pool.query('UPDATE columns SET sequence = $1, updated_at = $2 WHERE id = $3 RETURNING *;', [sequence, updatedByTimeStamp, id]);
  
  if (updatedColumnSeq.rowCount === 0 || updatedColumnSeq === null) {
    throw new Error('Failed to update column.');
  }

  return res.status(200).json({
    status: "Success! Updated board.",
    data: {
      column: updatedColumnSeq.rows[0]
    }
  });
});
export default handler;