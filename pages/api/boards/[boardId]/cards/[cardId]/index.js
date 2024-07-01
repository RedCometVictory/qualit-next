import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// get details of the card
handler.get(async (req, res) => {
  const { boardId, cardId } = req.query;
  const card = await pool.query('SELECT * FROM cards WHERE id = $1;', [cardId]);
  if (card.rowCount === 0 || card === null) {
    throw new Error("Failed to retrieve card information.");
  }
  return res.status(200).json({
    status: "Retrieved card.",
    data: {
      card: card.rows[0]
    }
  });
});

// update card data (not sequence) for column & board
handler.put(async (req, res) => {
  // const { id } = req.user;
  console.log("TTTTTTTTTTTTTTTTTTTTTTTTTT")
  console.log("TTTTTTTTTTTTTTTTTTTTTTTTTT")
  console.log("req.query")
  console.log(req.query)
  console.log("TTTTTTTTTTTTTTTTTTTTTTTTTT")
  console.log("req.body")
  console.log(req.body)
  const { boardId, cardId } = req.query;
  const { title, description, priority, type } = req.body;
  
  let updatedByTimeStamp = new Date();
  let updatedCard = await pool.query('UPDATE cards SET title = $1, description = $2, priority = $3, type = $4, updated_at = $5 WHERE id = $6 AND board_id = $7;', [title, description, priority, type, updatedByTimeStamp, cardId, boardId]);
  
  if (updatedCard.rowCount === 0 || updatedCard === null) {
    throw new Error('Failed to update card.');
  }
  console.log("TTTTTTTTTTTTTTTTTTTTTTTTTT")
  console.log("TTTTTTTTTTTT END TTTTTTTTTTTTTT")
  return res.status(201).json({
    status: "Success! Updated card.",
    data: {
      card: updatedCard.rows[0]
    }
  });
});

// slug = board_id - delete single card  belonging to column
// TODO: set admin to delete any board and user to only delete user owned boards and content
handler.delete(async (req, res) => {
  const { id } = req.user;
  const { boardId, cardId } = req.query;
  
  await pool.query('Delete FROM cards WHERE id = $1 AND board_id = $2;', [cardId, boardId]);

  return res.status(200).json({
    status: "Deleted card."
  })
});
export default handler;