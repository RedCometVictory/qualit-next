// import nc from 'next-connect';
// import { onError, onNoMatch } from '@/utils/ncOptions';
// import { verifAuth, authRoleDev } from '@/utils/verifAuth';
// import { pool } from '@/config/db';

// export const config = {
//   api: { bodyParser: false }
// };

// const handler = nc({onError, onNoMatch});
// handler.use(verifAuth, authRoleDev);

// handler.delete(async (req, res) => {
//   const { columnId, cardId } = req.query;

//   await pool.query('DELETE FROM cards WHERE id = $1 AND column_id = $2;', [cardId, columnId]);
//   return res.status(200).json({
//     status: "Deleted card."
//   });
// });
// export default handler;