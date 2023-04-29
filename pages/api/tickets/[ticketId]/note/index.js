// create note for ticket; copy code from tickets/[ticketId]/comment/index

import nc from 'next-connect';
import { upload } from "@/utils/multer";
import { removeOnErr } from '@/utils/cloudinary';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';
import { singleISODate } from '@/utils/toISODate';

// bodyParser needs to be set to true in order to properly post info to the backend
export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
// handler.use(verifAuth, authRoleDev);
handler.use(verifAuth);
/* DELETE THIS GET RESPONSE OR CHANGE TO SOMETHING ELSE
// get more comments belonging to ticket via pagination
handler.get(async (req, res) => {
  const { ticketId } = req.query;
  const { id, role } = req.query;

  // If orderBy is true then the order of comments is newest first, thus psql DESC
  const {
    pageNumber,
    itemsPerPage, // offsetItems
    orderBy
  } = req.query;
  let order = JSON.parse(orderBy);
  let page = Number(pageNumber);
  if (page < 1) page = 1;
  let limit = Number(itemsPerPage) || 20;
  let offset = (page - 1) * limit;
  let count;
  let totalComments;
  let ticketComments;

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

  totalComments = await pool.query('SELECT COUNT(id) FROM messages;');

  count = totalComments.rows[0].count;
  Number(count);

  // DESC is newest first
  if (order) {
    ticketComments = await pool.query("SELECT M.id, M.message, M.ticket_id, M.created_at, U.id AS user_id, U.f_name, U.l_name, U.username, U.role FROM messages AS M JOIN users AS U ON M.user_id = U.id WHERE M.ticket_id = $1 ORDER BY M.created_at DESC LIMIT $2 OFFSET $3;", [ticketId, limit, offset]);
  }
  
  if (!order) {
    ticketComments = await pool.query("SELECT M.id, M.message, M.ticket_id, M.created_at, U.id AS user_id, U.f_name, U.l_name, U.username, U.role FROM messages AS M JOIN users AS U ON M.user_id = U.id WHERE M.ticket_id = $1 ORDER BY M.created_at ASC LIMIT $2 OFFSET $3;", [ticketId, limit, offset]);
  }
  
  if (ticketComments.rowCount > 0) {
    for (let i = 0; i < ticketComments.rows.length; i++) {
      let created_at = ticketComments.rows[i].created_at;
      let newDate = singleISODate(created_at);
      ticketComments.rows[i].created_at = newDate;
    };
  };
  
  for (let i = 0; i < ticketComments.rows.length; i++) {
    const ticketUploadQuery = 'SELECT id AS upload_id, file_url, file_name, file_mimetype, created_at AS uploaded_on FROM uploads WHERE message_id = $1;'; // ---
    const ticketUploadsPromise = await queryPromise(ticketUploadQuery, ticketComments.rows[i].id);
    let uploadInfo = ticketUploadsPromise.rows[0];
    if (uploadInfo) {
      uploadInfo.uploaded_on = singleISODate(uploadInfo.uploaded_on);
    };
    ticketComments.rows[i] = { ...ticketComments.rows[i], ...uploadInfo };
  }

  return res.status(200).json({
    status: "Retrieved ticket comments.",
    data: {
      comments: ticketComments.rows,
      page: page,
      pages: count
    }
  });
});
*/

// TODO: move this code block to correct api route, this is the route only for getting and creating new tickets
// create ticket note
handler.post(async (req, res) => {
// handler.post(async (req, res) => {
  const { id, role } = req.user;
  const { ticketId } = req.query;
  // const { ticketId } = req.params;

  console.log("=========CREATING NOTE==========")
  console.log("=========USER==========")
  console.log(req.user)
  console.log("===========TICKET========")
  console.log(ticketId)
  console.log("==========BODY=========")
  console.log(req.body)
  let { note } = req.body;
  console.log(note.length)
  if (note.length === 0) {
    throw new Error("Note must have content!"); 
  };
  console.log("inserting note into table")
  const newNote = await pool.query('INSERT INTO ticket_notes (note, user_id, ticket_id) VALUES ($1, $2, $3) RETURNING *;', [note, id, ticketId]);
  console.log("result")
  console.log(newNote.rows)
  console.log("result - end")
  if (newNote.rowCount === 0 || newNote === null) {
    throw new Error('Failed to create new note.');
  }

  return res.status(201).json({
    status: "Success! Created new comment.",
    data: {
      ...newNote.rows[0],
    }
  });
});

handler.delete(async (req, res) => {
  const { id, role } = req.user;
  const { ticketId, noteId } = req.query;

  if (role === "Admin") {
    await pool.query('DELETE FROM ticket_notes WHERE id = $1 AND ticket_id = $2;', [noteId, ticketId]);
  } else {
    // id not admin, must show ownership
    await pool.query('DELETE FROM ticket_notes WHERE id = $1 AND ticket_id = $2 AND user_id = $3;', [noteId, ticketId, id]);
  };

  return res.status(201).json({
    status: "Success! Ticket note removed.",
    data: {
      noteId: noteId
    }
  });
});
export default handler;