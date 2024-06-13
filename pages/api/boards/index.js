import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// Get all boards created by a user by their id
handler.get(async (req, res) => {
  const { id } = req.user;
  console.log("FFFFFFFFFFFFFFFFFFFFF")
  console.log("FFFFFFFFFFFFFFFFFFFFF")
  console.log("FFFFFFFFFFFFFFFFFFFFF")
  console.log("Fetching all boards.")
  console.log("FFFFFFFFFFFFFFFFFFFFF")
  console.log("FFFFFFFFFFFFFFFFFFFFF")
  console.log("FFFFFFFFFFFFFFFFFFFFF")
  // const { userid } = req.query;
  // perhaps set a limit of 30 boards or so at a time
  const boards = await pool.query('SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at DESC;', [id]);
  if (boards.rowCount === 0 || boards === null) {
    throw new Error('Unauthorized. Failed to get boards.');
  };

  return res.status(200).json({
    status: 'Success! Gathered all boards you own.',
    data: {
      boards: boards.rows
    }
  })
});

// create new board, userId is assigned via who created it
handler.post(async (req, res) => {
  const { id } = req.user;
  if (!id) {
    throw new Error('Unauthorized. Log in to create a board');
  }
  console.log("000000000000")
  console.log("req.body")
  console.log(req.body)
  console.log("000000000000")
  // TODO: consider assigning a random unsplash photo as the background image
  // const { name, backgroundImage } = req.body;
  const { name } = req.body;
  
  if (name.length > 320) {
    throw new Error('Board name should be 320 characters or less.');
  }
  
  // const newBoard = await pool.query('INSERT INTO boards (name, background_image, user_id) VALUES ($1, $2, $3) RETURNING *;', [name, backgroundImage, id]);
  const newBoard = await pool.query('INSERT INTO boards (name, user_id) VALUES ($1, $2) RETURNING *;', [name, id]);
  
  if (newBoard.rowCount === 0 || newBoard === null) throw new Error('Failed to create a board.');

  console.log("-----------------")
  console.log("-----------------")
  console.log("board added")
  console.log(newBoard.rows)
  console.log("-----------------")
  console.log("-----------------")
  return res.status(201).json({
    status: "Success! Created a new board.",
    data: {
      ...newBoard.rows[0]
    }
  });
});
export default handler;