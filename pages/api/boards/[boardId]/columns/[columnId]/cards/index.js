import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';
import { singleISODate } from '@/utils/toISODate';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// get all cards belonging to respective columns and board
handler.get(async (req, res) => {
  const { boardId } = req.query;

  const cards = await pool.query('SELECT * FROM cards WHERE board_id = $1;', [boardId]);
  if (cards.rowCount === 0 || cards === null) {
    throw new Error("Failed to get all cards belonging to this board.");
  }

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

// create new card for column via board_id
handler.post(async (req, res) => {
  const { id } = req.user;
  const { boardId, columnId } = req.query;
  const { title, description, priority, type, sequence } = req.body;
  
  let newCard = await pool.query('INSERT INTO cards (title, description, priority, type, sequence, board_id, column_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7 ,$8) RETURNING *;', [title, description, priority, type, sequence, boardId, columnId, id]);

  if (newCard.rowCount === 0 || newCard === null) {
    throw new Error('Failed to create new card.');
  }

  return res.status(201).json({
    status: "Success! Created new card.",
    data: {
      card: newCard.rows[0]
    }
  });
});

// delete all columns belonging to a board and all of the cards belonging to each column
// TODO: set admin to delete any board and user to only delete user owned boards and content
handler.delete(async (req, res) => {
  const { boardId } = req.query;

  await pool.query('DELETE FROM cards WHERE board_id = $1;', [boardId]);
  await pool.query('DELETE FROM columns WHERE board_id = $1;', [boardId]);
  return res.status(200).json({
    status: "Deleted all columns."
  });
});
export default handler;