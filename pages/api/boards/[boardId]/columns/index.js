import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// fetch all columns belonging to board
handler.get(async (req, res) => {
  // const { boardId } = req.query;
  const { boardId } = req.query;
  console.log("888888888888888888888888888")
  console.log("888888888888888888888888888")
  console.log("fetching columnz")
  console.log(boardId)
  console.log("888888888888888888888888888")
  console.log("888888888888888888888888888")
  const columns = await pool.query('SELECT * FROM columns WHERE board_id = $1;', [boardId]);
  // if (columns.rowCount === 0 || columns === null) {
    // throw new Error("Failed to get all columns belonging to this board.");
  // }

  console.log("XXXXXXXXXXXXXXXXXXXXXXXX")
  console.log("XXXXXXXXXXXXXXXXXXXXXXXX")
  console.log(columns.rows)
  console.log("XXXXXXXXXXXXXXXXXXXXXXXX")
  console.log("XXXXXXXXXXXXXXXXXXXXXXXX")
  return res.status(200).json({
    status: "Retrieved board.",
    data: {
      columns: columns.rows
    }
  });
});

// add column to board
handler.post(async (req, res) => {
  const { id } = req.user;
  const { boardId } = req.query;
  // const { name, sequence } = req.body;
  console.log("333333333333333333333333333")
  console.log("333333333333333333333333333")
  console.log("adding column to board")
  console.log("boardId")
  console.log(boardId)
  console.log("333333333333333333333333333")
  console.log("333333333333333333333333333")
  // let newColumn = await pool.query('INSERT INTO columns (name, sequence, board_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *;', [name, sequence, boardId, id]);
  let newColumn = await pool.query('INSERT INTO columns (board_id, user_id) VALUES ($1, $2) RETURNING *;', [boardId, id]);

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