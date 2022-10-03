import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

handler.get(async (req, res) => {
  const { slug } = req.query;
  const columns = pool.query('SELECT * FROM columns WHERE board_id = $1;', [slug]);
  if (columns.rowCount === 0 || columns === null) {
    throw new Error("Failed to get all columns belonging to this board.");
  }

  return res.status(200).json({
    status: "Retrieved board.",
    data: {
      columns: columns.rows
    }
  });
});

handler.post(async (req, res) => {
  const { id } = req.user;
  const { slug } = req.query;
  const { name, sequence } = req.body;
  
  let newColumn = pool.query('INSERT INTO columns (name, sequence, board_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *;', [name, sequence, slug, id]);

  if (newColumn.rowCount === 0 || newColumn === null) {
    throw new Error('Failed to create new column.');
  }

  return res.status(201).json({
    status: "Success! Created new column.",
    data: {
      column: newColumn.rows[0]
    }
  });
});
export default handler;