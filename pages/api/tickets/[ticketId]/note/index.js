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
  // api: { bodyParser: true }
  api: { bodyParser: false }
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
// create ticket comment
handler.post(async (req, res) => {
// handler.post(async (req, res) => {
  const { id, role } = req.user;
  const { ticket_id } = req.query;
  // const { ticketId } = req.params;

  console.log("=========USER==========")
  console.log(req.user)
  console.log("===========TICKET========")
  console.log(ticket_id)
  console.log("==========BODY=========")
  console.log(req.body)
  let { note } = req.body;
  
  if (note.length === 0) {
    throw new Error("Note must have content!"); 
  };

  const newComment = await pool.query('INSERT INTO tickets (notes) VALUES ($1) WHERE id = $2 RETURNING *;', [note, ticket_id]);

  

  // const newComment = {...comment.rows[0], ...commentFileUpload.rows[0]};

  // let newComment = await pool.query('INSERT INTO messages (message, user_id, ticket_id) VALUES ($1, $2, $3) RETURNING *;', [message, id, ticketId]);

  // if (newComment.rowCount === 0 || newComment === null) {
  //   throw new Error('Failed to create new comment.');
  // }

  // get comment and all potential uploads belonging to it,
  // todo: example
  // products = await pool.query(
  //         'SELECT P.*, I.* FROM products AS P JOIN images AS I ON P.id = I.product_id WHERE P.category = $1 GROUP BY I.id, P.id LIMIT $2 OFFSET $3;', [category, limit, offset]
  //       );

  // res.status(201).json({
  //   status: "Ticket comment created.",
  //   data: {
  //     comment
  //   }
  // });

  return res.status(201).json({
    status: "Success! Created new comment.",
    data: {
      ...newComment.rows[0],
      ...commentFileUpload.rows[0]
    }
  });
});
export default handler;