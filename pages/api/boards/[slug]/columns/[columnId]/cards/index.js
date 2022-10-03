// import nc from 'next-connect';
// import { onError, onNoMatch } from '@/utils/ncOptions';
// import { verifAuth, authRoleDev } from '@/utils/verifAuth';
// import { pool } from '@/config/db';

// export const config = {
//   api: { bodyParser: false }
// };

// const handler = nc({onError, onNoMatch});
// handler.use(verifAuth, authRoleDev);

// // get all columns and their respective cards
// handler.get(async (req, res) => {
//   const { slug } = req.query;
//   const columns = pool.query('SELECT * FROM columns WHERE board_id = $1;', [slug]);
//   const cards = pool.query('SELECT * FROM cards WHERE board_id = $1;', [slug]);
//   if (columns.rowCount === 0 || columns === null) {
//     throw new Error("Failed to get all columns belonging to this board.");
//   }
//   if (cards.rowCount === 0 || cards === null) {
//     throw new Error("Failed to get all cards belonging to this board.");
//   }

//   return res.status(200).json({
//     status: "Retrieved board.",
//     data: {
//       columns: columns.rows,
//       cards: cards.rows
//     }
//   });
// });

// // create new card for column
// handler.post(async (req, res) => {
//   const { id } = req.user;
//   const { slug, columnId } = req.query;
//   const { title, description, priority, type, sequence } = req.body;
  
//   let newCard = pool.query('INSERT INTO cards (title, description, priority, type, sequence, board_id, column_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *;', [title, description, priority, type, sequence, slug, columnId, id]);

//   if (newCard.rowCount === 0 || newCard === null) {
//     throw new Error('Failed to create new card.');
//   }

//   return res.status(201).json({
//     status: "Success! Created new card.",
//     data: {
//       card: newCard.rows[0]
//     }
//   });
// });


// // delete all columns belonging to a board and all of the cards belonging to each column
// handler.delete(async (req, res) => {
//   const { slug } = req.query;

//   await pool.query('DELETE FROM cards WHERE board_id = $1;', [slug]);
//   await pool.query('DELETE FROM columns WHERE board_id = $1;', [slug]);
//   return res.status(200).json({
//     status: "Deleted all columns."
//   });
// });
// export default handler;