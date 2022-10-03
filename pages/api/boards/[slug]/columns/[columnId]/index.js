import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// update column, sequence is '' if its not to be updated
handler.put(async (req, res) => {
  const { slug, columnId } = req.query;
  const { name, sequence } = req.body;

  let updatedByTimeStamp = new Date();
  let updatedColumn;
  if (!sequence) {
    // update name of column
    updatedColumn = await pool.query('UPDATE columns SET name = $1, updated_at = $2 WHERE id = $3 RETURNING *;', [name, updatedByTimeStamp, columnId]);
  } else {
    // update sequence of column
    updatedColumn = await pool.query('UPDATE columns SET sequence = $1, updated_at = $2 WHERE id = $3 RETURNING *;', [sequence, updatedByTimeStamp, columnId]);
  };

  if (updatedColumn.rowCount === 0 || updatedColumn === null) {
    throw new Error('Failed to update column.');
  }

  return res.status(200).json({
    status: "Success! Updated board.",
    data: {
      column: updatedColumn.rows[0]
    }
  });
});

// delete a column and its respective cards
handler.delete(async (req, res) => {
  const { columnId } = req.query;

  await pool.query('DELETE FROM cards WHERE column_id = $1;', [columnId]);
  await pool.query('DELETE FROM columns WHERE id = $1;', [columnId]);
  return res.status(200).json({
    status: "Deleted column."
  });
});
export default handler;