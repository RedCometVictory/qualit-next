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
  const cards = pool.query('SELECT * FROM cards WHERE id = $1;', [slug]);
  if (cards.rowCount === 0 || cards === null) {
    throw new Error("Failed to retrieve board information.");
  }
  return res.status(200).json({
    status: "Retrieved board.",
    data: {
      cards: cards.rows
    }
  });
});

// slug = board_id
// delete all cards & columns
// handler.delete(async (req, res) => {
//   const { id } = req.user;
//   const { slug } = req.query;
  
//   await pool.query('Delete FROM cards WHERE board_id = $1;', [slug]);
  
//   return res.status(200).json({
//     status: "Deleted all cards and thus columns of a board."
//   })
// });
export default handler;