import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// get individual board info
handler.get(async (req, res) => {
  const { boardId } = req.query;
  const board = await pool.query('SELECT * FROM boards WHERE id = $1;', [boardId]);
  if (board.rowCount === 0 || board === null) {
    throw new Error("Failed to retrieve board information.");
  }
  return res.status(200).json({
    status: "Retrieved board.",
    data: {
      board: board.rows[0]
    }
  });
});

// save board update
handler.put(async (req, res) => {
  // const { id } = req.user;
  const { boardId } = req.query;
  const { name, description, backgroundImage } = req.body;
  let updatedByTimeStamp = new Date();
  let updatedBoard = await pool.query('UPDATE boards SET name = $1, description = $2, background_image = $3, updated_at = $4 WHERE id = $5;', [name, description, backgroundImage, updatedByTimeStamp, boardId]);

  if (updatedBoard.rowCount === 0 || updatedBoard === null) {
    throw new Error('Failed to update board.');
  }
  return res.status(201).json({
    status: "Success! Updated board.",
    data: {
      board: updatedBoard.rows[0]
    }
  });
});

// slug = board_id | delete board
// TODO: set admin to delete any board and user to only delete user owned boards and content
handler.delete(async (req, res) => {
  const { id } = req.user;
  const { boardId } = req.query;
  
  await pool.query('Delete FROM cards WHERE board_id = $1;', [boardId]);
  await pool.query('Delete FROM columns WHERE board_id = $1;', [boardId]);
  await pool.query('Delete FROM boards WHERE id = $1;', [boardId]);
  
  return res.status(200).json({
    status: "Deleted board."
  });
});
export default handler;