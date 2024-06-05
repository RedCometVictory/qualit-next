import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

/* May not use this put method
handler.put(async (req, res) => {
  const { slug, columnId, cardId } = req.query;
  const { title, sequence } = req.body;
  let updatedCard = await pool.query('UPDATE cards SET title = $1 WHERE column_id = $2 AND card_id = $3 AND board_id = $4;', [title, columnId, cardId, boardId]);

  if (updatedCard.rowCount === 0 || updatedCard === null) {
    throw new Error('Failed to update card.');
  }
  return res.status(201).json({
    status: "Success! Updated card.",
    data: {
      card: updatedCard.rows[0]
    }
  });
});
*/

// TODO: set admin to delete any board and user to only delete user owned boards and content
handler.delete(async (req, res) => {
  // slug is the id of the board
  const { boardId, columnId, cardId } = req.query;

  // await pool.query('DELETE FROM cards WHERE id = $1 AND column_id = $2;', [cardId, columnId]);
  await pool.query('DELETE FROM cards WHERE id = $1 AND board_id = $2 AND column_id = $3;', [cardId, boardId, columnId]);
  return res.status(200).json({
    status: "Deleted card."
  });
});
export default handler;