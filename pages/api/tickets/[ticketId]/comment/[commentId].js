import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
// handler.use(verifAuth, authRoleDev);
handler.use(verifAuth);

// get a list of tickets for dashboard
// handler.get(async (req, res) => {
//   const { ticketId } = req.query;
//   const { id, role } = req.user;
//   console.log("########## BACKEND ##########");
//   console.log("|/\/\/\/\/\/\/\/\/\/\|")
//   console.log("req")
//   console.log(req)
//   console.log("|\/\/\/\/\/\/\/\/\/\/|")
//   let ticketDetails;
//   // paginate comments and uploads
//   let ticketComments;
//   let ticketUploads;
//   let ticketHistory;

//   const queryPromise = (query, ...values) => {
//     return new Promise((resolve, reject) => {
//       pool.query(query, values, (err, res) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(res);
//         }
//       })
//     })
//   };

//   ticketDetails = await pool.query("SELECT * FROM tickets WHERE id = $1;", [ticketId]);
//   ticketComments = await pool.query("SELECT M.*, U.id AS user_id, U.f_name, U.l_name, U.username FROM messages AS M JOIN users AS U ON M.user_id = U.id WHERE ticket_id = $1;", [ticketId]);
//   ticketHistory = await pool.query("SELECT * FROM histories WHERE ticket_id = $1;", [ticketId]);
//   // get upload belonging to each indiv comment if available, run through queryPromise
//   // get the ticket edit history
//   for (let i = 0; i < ticketComments.rowCount; i++) {
//     ticketUploadQuery = "SELECT * FROM uploads WHERE message_id = $1;";
//     // combine upload with respective message
//     const ticketUploadsPromise = await queryPromise(ticketUploadQuery, [ticketComments.rows[i].id]);
//     ticketComments.rows[i] = {...ticketComments.rows[i], ...ticketUploadsPromise.rows[0]}
//   };
    
//   console.log("$$$$$$$$$$$$$$$$$$$$$$$")
//   console.log("final results")
//   console.log(ticketDetails.rows)
//   console.log("$$$$$$$$$$$$$$$$$$$$$$$")
//   console.log(ticketComments.rows)
//   console.log("$$$$$$$$$$$$$$$$$$$$$$$")
//   console.log(ticketHistory.rows)
//   console.log("$$$$$$$$$$$$$$$$$$$$$$$")
//   console.log("$$$$$$$$$$$$$$$$$$$$$$$")
//   return res.status(200).json({
//     status: "Retrieved dashboard information.",
//     data: {
//       ticket: ticketDetails.rows[0],
//       comments: ticketComments.rows,
//       history: ticketHistory.rows
//     }
//   });
// });



handler.put(async (req, res) => {
  // const { id } = req.user;
  const { slug } = req.query;
  const { name, description, backgroundImage } = req.body;
  let updatedByTimeStamp = new Date();
  let updatedBoard = await pool.query('UPDATE boards SET name = $1, description = $2, background_image = $3, updated_at = $4 WHERE id = $5;', [name, description, backgroundImage, updatedByTimeStamp, slug]);

  if (updatedBoard.rowCount === 0 || updatedBoard === null) {
    throw new Error('Failed to update board.');
  }
  return res.status(201).json({
    status: "Success! Updated board.",
    data: {
      board: updatedBoard.rows[0]
    }
  });
});

// slug = board_id
handler.delete(async (req, res) => {
  const { id } = req.user;
  const { slug } = req.query;
  
  await pool.query('Delete FROM cards WHERE board_id = $1;', [slug]);
  await pool.query('Delete FROM columns WHERE board_id = $1;', [slug]);
  await pool.query('Delete FROM boards WHERE id = $1;', [slug]);
  
  return res.status(200).json({
    status: "Deleted board."
  });
});
export default handler;