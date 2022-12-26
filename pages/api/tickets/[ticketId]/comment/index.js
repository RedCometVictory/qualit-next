import nc from 'next-connect';
import { upload } from "@/utils/multer";
import { removeOnErr } from '@/utils/cloudinary';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

// bodyParser needs to be set to true in order to properly post info to the backend
export const config = {
  // api: { bodyParser: true }
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

// TODO: move this code block to correct api route, this is the route only for getting and creating new tickets
// create ticket comment
handler.use(upload.single('upload')).post(async (req, res) => {
// handler.post(async (req, res) => {
  const { id } = req.user;
  const { ticketId } = req.query;
  // const { ticketId } = req.params;

  console.log("req.params")
  console.log(req.params)
  console.log("req.query")
  console.log(req.query)
  console.log("=========USER==========")
  console.log(req.user)
  console.log("===========TICKET========")
  console.log(ticketId)
  console.log("==========FILE=========")
  console.log(req.file)
  console.log("==========BODY=========")
  console.log(req.body)
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

  console.log("fileUrl")
  console.log(fileUrl)
  console.log("fileFilename")
  console.log(fileFilename)

  if (fileUrl.startsWith('public\\')) {
    let editFileUrl = fileUrl.slice(6);
    fileUrl = editFileUrl;
  }

  console.log(message)
  console.log(id)
  console.log(ticketId)

  const newComment = await pool.query('INSERT INTO messages (message, user_id, ticket_id) VALUES ($1, $2, $3) RETURNING *;', [message, id, ticketId]);

  console.log("moving onto the new file upload")
  const commentFileUpload = await pool.query("INSERT INTO uploads (file_url, file_name, message_id) VALUES ($1, $2, $3) RETURNING *;", [fileUrl, fileFilename, newComment.rows[0].id]);

  console.log("newComment")
  console.log(newComment)
  console.log("commentFileUpload")
  console.log(commentFileUpload)


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
      // comment: newComment.rows[0]
      comment: {
        comment: newComment.rows[0],
        upload: commentFileUpload.rows[0]
      }
    }
  });
});
export default handler;