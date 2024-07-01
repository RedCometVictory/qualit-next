import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// update card sequence for column & board
handler.put(async (req, res) => {
  // const { id } = req.user;
  const { boardId, cardId } = req.query;
  const { id: unusedPatchedCardId , sequence, columnId } = req.body;

  console.log("0101010101010101010101010")
  console.log("0101010101010101010101010")
  console.log("now sequencing card");
  console.log("req.body")
  console.log(req.body)
  
  let updatedByTimeStamp = new Date();
  let updatedCardSeq = await pool.query('UPDATE cards SET sequence = $1, column_id = $2, updated_at = $3 WHERE id = $4 AND board_id = $5 RETURNING *;', [sequence, columnId, updatedByTimeStamp, cardId, boardId]);
  
  if (updatedCardSeq.rowCount === 0 || updatedCardSeq === null) {
    throw new Error('Failed to update card.');
  }
  console.log("updatedCardSeq.orws")
  console.log(updatedCardSeq.rows)
  console.log("updatedCardSeq.orws[0]")
  console.log(updatedCardSeq.rows[0])
  console.log("finished sequencing ccard via BE")
  console.log("0101010101010101010101010")
  console.log("0101010101010101010101010")
  return res.status(201).json({
    status: "Success! Updated card.",
    data: {
      card: updatedCardSeq.rows[0]
    }
  });
});
export default handler;


// fetch all cards
/**
 * 
 * 
 * 
 * 
 * 
 * 


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











 */