import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// get details of the card
handler.get(async (req, res) => {
  const { slug, cardId } = req.query;
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

handler.put(async (req, res) => {
  // const { id } = req.user;
  const { slug, cardId } = req.query;
  const { title, description, priority, type, sequence } = req.body;

  let updatedByTimeStamp = new Date();
  let updatedCard = await pool.query('UPDATE cards SET title = $1, description = $2, priority = $3, type = $4, sequence = $5, updated_at = $6 WHERE id = $7 AND board_id = $8;', [title, description, priority, type, sequence,  updatedByTimeStamp, cardId, slug]);

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

// slug = board_id
handler.delete(async (req, res) => {
  const { id } = req.user;
  const { slug, cardId } = req.query;
  
  await pool.query('Delete FROM cards WHERE id = $1 AND board_id = $2;', [cardId, slug]);

  return res.status(200).json({
    status: "Deleted card."
  })
});
export default handler;