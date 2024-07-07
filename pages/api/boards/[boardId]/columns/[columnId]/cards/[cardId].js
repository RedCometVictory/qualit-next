import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// TODO: set admin to delete any board and user to only delete user owned boards and content
handler.delete(async (req, res) => {
  const { boardId, columnId, cardId } = req.query;

  await pool.query('DELETE FROM cards WHERE id = $1 AND board_id = $2 AND column_id = $3;', [cardId, boardId, columnId]);
  return res.status(200).json({
    status: "Deleted card."
  });
});
export default handler;