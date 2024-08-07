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

// ROUTE for paginate project tickets
// get more comments belonging to ticket via pagination
handler.get(async (req, res) => {
  const { projectId } = req.query;
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
  let totalTickets;
  let projectTickets;

  totalTickets = await pool.query('SELECT COUNT(id) FROM tickets WHERE project_id = $1;', [projectId]);

  count = totalTickets.rows[0].count;
  Number(count);

  // DESC is newest first
  if (order) {
    projectTickets = await pool.query("SELECT M.*, U.id AS user_id, U.f_name, U.l_name, U.username FROM messages AS M JOIN users AS U ON M.user_id = U.id WHERE ticket_id = $1 ORDER BY M.created_at DESC LIMIT $2 OFFSET $3;", [projectId, limit, offset]);
  }
  
  if (!order) {
    // TODO: chenage query for project tickets per each user role type
    // TODO: re-edit queries for pagination
    // project tickets for developers
    if (role === 'Developer') {
      projectTickets = await pool.query('SELECT id, title, status, priority, type, created_at FROM tickets WHERE user_id = $1 ORDER BY created_at DESC LIMIT 25;', [id]);
    };
    // project tickets for Project managers
    if (role === 'Project Manager') {
      projectTickets = "SELECT T.id, T.title, T.type, T.priority, T.status, T.created_at FROM tickets AS T WHERE T.project_id = $1 LIMIT 25;";
    };
    // project tickets for Admin
    if (role === "Admin") {
      projectTickets = "SELECT T.id, T.title, T.type, T.priority, T.status, T.created_at FROM tickets AS T WHERE T.project_id = $1 LIMIT 25;";
      // or use!!!!!!!!!!!!
      // projectTickets = await pool.query('SELECT id, title, status, priority, type, created_at FROM tickets LIMIT 25;');
    };
    // projectTickets = await pool.query("SELECT M.*, U.id AS user_id, U.f_name, U.l_name, U.username FROM messages AS M JOIN users AS U ON M.user_id = U.id WHERE ticket_id = $1 ORDER BY M.created_at ASC LIMIT $2 OFFSET $3;", [projectId, limit, offset]);
  }
  
  if (ticketComments.rowCount > 0) {
    for (let i = 0; i < ticketComments.rows.length; i++) {
      let created_at = ticketComments.rows[i].created_at;
      let newDate = singleISODate(created_at);
      ticketComments.rows[i].created_at = newDate;
    };
  };

  return res.status(200).json({
    status: "Retrieved ticket comments.",
    data: {
      comments: ticketComments.rows,
      page: page,
      pages: count
    }
  });
});

// TODO: move this code block to correct api route, this is the route only for getting and creating new tickets
// create ticket comment
handler.use(upload.single('upload')).post(async (req, res) => {
// handler.post(async (req, res) => {
  const { id } = req.user;
  const { ticketId } = req.query;

  let { message } = req.body;
  let fileUrl = "";
  let fileFilename = "";
  // TODO: consider - if commenting you do not need to proviide text if uploading a image or doc, however is no text is found and no upload is found then casuse an error

  // if (message === null || !message || message.length === 0) {
  //   if (req.file) {
  //     await removeOnErr(req.file.upload);
  //   }
  //   return res.status(400).json({ errors: [{ msg: "Comment is required." }] });
  // }
  
  if (req.file && req.file.path) {
    fileUrl = req.file.path;
    fileFilename = req.file.filename;
  }

  if (fileUrl.startsWith('public\\')) {
    let editFileUrl = fileUrl.slice(6);
    fileUrl = editFileUrl;
  }

  const newComment = await pool.query('INSERT INTO messages (message, user_id, ticket_id) VALUES ($1, $2, $3) RETURNING *;', [message, id, ticketId]);

  const commentFileUpload = await pool.query("INSERT INTO uploads (file_url, file_name, message_id) VALUES ($1, $2, $3) RETURNING *;", [fileUrl, fileFilename, newComment.rows[0].id]);

  return res.status(201).json({
    status: "Success! Created new comment.",
    data: {
      ...newComment.rows[0],
      upload: commentFileUpload.rows[0]
    }
  });
});
export default handler;