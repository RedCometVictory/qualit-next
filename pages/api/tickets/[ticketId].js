import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';
import { singleISODate } from '@/utils/toISODate';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
// handler.use(verifAuth, authRoleDev);
handler.use(verifAuth);

// get ticket details
handler.get(async (req, res) => {
  const { ticketId } = req.query;
  const { id, role } = req.user;

  let ticketDetails;
  // paginate comments and uploads
  let ticketNotes;
  let ticketAssignedDev;
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

  ticketDetails = await pool.query("SELECT * FROM tickets WHERE id = $1;", [ticketId]);

  ticketNotes = await pool.query("SELECT * FROM ticket_notes WHERE ticket_id = $1 ORDER BY created_at DESC;", [ticketId]);
  
  // TODO: test this code using jest
  if (ticketDetails.rowCount > 0) {
    ticketDetails.rows[0].created_at = singleISODate(ticketDetails.rows[0].created_at);
  };

  if (ticketDetails.rows[0].user_id) {
    ticketAssignedDev = await pool.query("SELECT f_name, l_name FROM users WHERE id = $1;", [ticketDetails.rows[0].user_id]);
  }
  
  totalComments = await pool.query('SELECT COUNT(id) FROM messages WHERE ticket_id = $1;', [ticketId]);

  count = totalComments.rows[0].count;
  Number(count);

  ticketComments = await pool.query("SELECT M.id, M.message, M.ticket_id, M.created_at, U.id AS user_id, U.f_name, U.l_name, U.username, U.role FROM messages AS M JOIN users AS U ON M.user_id = U.id WHERE M.ticket_id = $1 ORDER BY M.created_at DESC LIMIT 20;", [ticketId]);
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
    status: "Retrieved ticket information.",
    data: {
      // ticket: ticketDetails.rows[0], // --- original
      ticket: {...ticketDetails.rows[0], assignedUser: ticketAssignedDev.rows[0].f_name + " " + ticketAssignedDev.rows[0].l_name}, // --- original
      // assignedUser: ticketAssignedDev.rows[0],
      notes: ticketNotes.rows,
      comments: ticketComments.rows,
      history: ticketHistory.rows,
      page: 1,
      pages: count
    }
  });
});

handler.put(async (req, res) => {
  const { ticketId } = req.query;
  const { title, description, status, priority, type, deadline } = req.body;

  let updatedByTimeStamp = new Date();
  let updatedTicket = await pool.query('UPDATE tickets SET title = $1, description = $2, status = $3, priority = $4, type = $5, deadline = $6, updated_at = $7 WHERE id = $8;', [title, description, status, priority, type, deadline, updatedByTimeStamp, ticketId]);

  if (updatedTicket.rowCount === 0 || updatedTicket === null) {
    throw new Error('Failed to update ticket.');
  };

  return res.status(201).json({
    status: "Success! Updated ticket.",
    data: {
      ticket: updatedTicket.rows[0]
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