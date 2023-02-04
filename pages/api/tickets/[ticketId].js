import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';
import { singleISODate } from '@/utils/toISODate';

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
  // TODO: need to implement pagination for ticket comments to limit the loading of tickets
  console.log("########## BACKEND ##########");
  let ticketDetails;
  // paginate comments and uploads
  let ticketComments;
  let totalComments;
  let ticketUploads;
  let ticketHistory;
  let count;

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

  // TODO: hydration error caused possibly due to not converting the created_at date from tickets to their respective comments annd the history.Thus on the backend convert the dates to be more easily readable so that client side can render properly.
  ticketDetails = await pool.query("SELECT * FROM tickets WHERE id = $1;", [ticketId]);
  
  // TODO: test this code using jest
  if (ticketDetails.rowCount > 0) {
    ticketDetails.rows[0].created_at = singleISODate(ticketDetails.rows[0].created_at);
  };
  
  totalComments = await pool.query('SELECT COUNT(id) FROM messages WHERE ticket_id = $1;', [ticketId]);

  count = totalComments.rows[0].count;
  Number(count);

  ticketComments = await pool.query("SELECT M.id, M.message, M.ticket_id, M.created_at, U.id AS user_id, U.f_name, U.l_name, U.username FROM messages AS M JOIN users AS U ON M.user_id = U.id WHERE M.ticket_id = $1 ORDER BY M.created_at DESC LIMIT 20;", [ticketId]);
  // todo: get the ticket edit history
  ticketHistory = await pool.query("SELECT * FROM histories WHERE ticket_id = $1;", [ticketId]);
  
  if (ticketComments.rowCount > 0) {
    for (let i = 0; i < ticketComments.rows.length; i++) {
      let created_at = ticketComments.rows[i].created_at;
      let newDate = singleISODate(created_at);
      ticketComments.rows[i].created_at = newDate;
    };
  };

  if (ticketHistory.rowCount > 0) {
    for (let i = 0; i < ticketHistory.rows.length; i++) {
      let created_at = ticketHistory.rows[i].created_at;
      let newDate = singleISODate(created_at);
      ticketHistory.rows[i].created_at = newDate;
    };
  };
  
  for (let i = 0; i < ticketComments.rows.length; i++) {
    const ticketUploadQuery = 'SELECT id AS upload_id, file_url, file_name, created_at AS uploaded_on FROM uploads WHERE message_id = $1;'; // ---
    const ticketUploadsPromise = await queryPromise(ticketUploadQuery, ticketComments.rows[i].id);
    let uploadInfo = ticketUploadsPromise.rows[0];
    if (uploadInfo) {
      uploadInfo.uploaded_on = singleISODate(uploadInfo.uploaded_on);
    };
    ticketComments.rows[i] = { ...ticketComments.rows[i], ...uploadInfo };
  }

  return res.status(200).json({
    status: "Retrieved dashboard information.",
    data: {
      ticket: ticketDetails.rows[0],
      comments: ticketComments.rows,
      history: ticketHistory.rows,
      page: 1,
      pages: count
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