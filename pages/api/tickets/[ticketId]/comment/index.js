import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

// bodyParser needs to be set to true in order to properly post info to the backend
export const config = {
  api: { bodyParser: true }
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

// create comment for ticket
handler.post(async (req, res) => {
  const { id } = req.user;
  const { ticketId } = req.query;
  console.log("=========USER==========")
  console.log(req.user)
  console.log("===========TICKET========")
  console.log(ticketId)
  console.log("==========BODY=========")
  console.log(req.body)
  let { formData } = req.body;
  let parsedformData = JSON.parse(formData)
  console.log("parsedformData")
  console.log(parsedformData)
  console.log("0000000")
  console.log("message")
  let message = formData;
  console.log(message)
  return;
  let newComment = await pool.query('INSERT INTO messages (message, user_id, ticket_id) VALUES ($1, $2, $3) RETURNING *;', [message, id, ticketId]);

  if (newComment.rowCount === 0 || newComment === null) {
    throw new Error('Failed to create new comment.');
  }

  // get comment and all potential uploads belonging to it,
  // todo: example
  // products = await pool.query(
  //         'SELECT P.*, I.* FROM products AS P JOIN images AS I ON P.id = I.product_id WHERE P.category = $1 GROUP BY I.id, P.id LIMIT $2 OFFSET $3;', [category, limit, offset]
  //       );

  return res.status(201).json({
    status: "Success! Created new comment.",
    data: {
      comment: newComment.rows[0]
    }
  });
});
export default handler;