import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';
import { singleISODate } from '@/utils/toISODate';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// fetch cards belonging to column & board
handler.get(async (req, res) => {
  const { boardId } = req.query;
  const cards = await pool.query('SELECT * FROM cards WHERE board_id = $1;', [boardId]);
  if (cards.rowCount === 0 || cards === null) {
    throw new Error("Failed to retrieve all cards belonging to board.");
  };

  for (let i = 0; i < cards.rows.length; i++) {
    cards.rows[i].created_at = singleISODate(cards.rows[i].created_at);
    if (cards.rows[i].updated_at) {
      cards.rows[i].updated_at = singleISODate(cards.rows[i].updated_at);
    }
  };

  return res.status(200).json({
    status: "Retrieved board.",
    data: {
      cards: cards.rows
    }
  });
});

// TODO: set admin to delete any board and user to only delete user owned boards and content
// delete all cards & columns
handler.delete(async (req, res) => {
  const { id } = req.user;
  const { boardId } = req.query;
  
  await pool.query('Delete FROM cards WHERE board_id = $1;', [boardId]);
  
  return res.status(200).json({
    status: "Deleted all cards and thus columns of a board."
  })
});
export default handler;