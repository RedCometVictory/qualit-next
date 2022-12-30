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
handler.get(async (req, res) => {
  const { ticketId } = req.query;
  const { id, role } = req.user;
  console.log("########## BACKEND ##########");
  let ticketDetails;
  // paginate comments and uploads
  let ticketComments;
  let ticketUploads;
  let ticketHistory;

  const queryPromise = (query, ...values) => {
    return new Promise((resolve, reject) => {
      pool.query(query, values, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      })
    })
  };

  ticketDetails = await pool.query("SELECT * FROM tickets WHERE id = $1;", [ticketId]);
  ticketComments = await pool.query("SELECT M.*, U.id AS user_id, U.f_name, U.l_name, U.username FROM messages AS M JOIN users AS U ON M.user_id = U.id WHERE ticket_id = $1;", [ticketId]);
  ticketHistory = await pool.query("SELECT * FROM histories WHERE ticket_id = $1;", [ticketId]);
  console.log("END OF MAIN QUERIES")
  console.log(ticketComments.rows[0])
  console.log(ticketComments.rows[0].id)
  // get upload belonging to each indiv comment if available, run through queryPromise
  // get the ticket edit history

  // if (products.rows.length > 0) {
  //   if (products.rowCount >= 1) {
  //     for (let i = 0; i < products.rows.length; i++) {
  //       let created_at = products.rows[i].created_at;
  //       let newCreatedAt = created_at.toISOString().slice(0, 10);
  //       products.rows[i].created_at = newCreatedAt;
  //     }
  //   };
    for (let i = 0; i < ticketComments.rows.length; i++) {
      const ticketUploadQuery = 'SELECT id AS upload_id, file_url, file_name, message_id, created_at FROM uploads WHERE message_id = $1;';
      const ticketUploadsPromise = await queryPromise(ticketUploadQuery, ticketComments.rows[i].id);
      let uploadInfo = ticketUploadsPromise.rows[0];
      ticketComments.rows[i] = { ...ticketComments.rows[i], ...uploadInfo };
    }
  // }
    
  console.log("$$$$$$$$$$$$$$$$$$$$$$$")
  console.log("final results")
  console.log(ticketDetails.rows[0])
  console.log("$$$$$$$$$$$$$$$$$$$$$$$")
  console.log(ticketComments.rows)
  console.log("$$$$$$$$$$$$$$$$$$$$$$$")
  console.log(ticketHistory.rows)
  console.log("$$$$$$$$$$$$$$$$$$$$$$$")
  console.log("$$$$$$$$$$$$$$$$$$$$$$$")
  return res.status(200).json({
    status: "Retrieved dashboard information.",
    data: {
      ticket: ticketDetails.rows[0],
      comments: ticketComments.rows,
      history: ticketHistory.rows
    }
  });
});

// handler.post(async (req, res) => {
//   const { id } = req.user;
//   const { slug } = req.query;
//   const { name, sequence } = req.body;
  
//   let newColumn = await pool.query('INSERT INTO columns (name, sequence, board_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *;', [name, sequence, slug, id]);

//   if (newColumn.rowCount === 0 || newColumn === null) {
//     throw new Error('Failed to create new column.');
//   }

//   return res.status(201).json({
//     status: "Success! Created new column.",
//     data: {
//       column: newColumn.rows[0]
//     }
//   });
// });
export default handler;