import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';
import { cloudinary } from '@/utils/cloudinary';
// import { upload } from '@/utils/multer';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
// handler.use(verifAuth, authRoleDev);
handler.use(verifAuth);

// todo set up means of updating comment
// handler.put(async (req, res) => {});

// TODO: need to delete comment
handler.delete(async (req, res) => {
  const { id, role } = req.user;
  const { ticketId, commentId } = req.query;

  // search if comment has an uploaded image or pdf file
  const imageExists = await pool.query('SELECT * FROM uploads WHERE message_id = $1;', [commentId]);

  let currentImageFilename = null;
  if (imageExists.rowCount > 0) {
    currentImageFilename = imageExists.rows[0].file_name;
  }

  if (currentImageFilename) {
    await cloudinary.uploader.destroy(currentImageFilename);
  }

  // commentId is message id
  if (role === "Admin") {
    await pool.query('Delete FROM messages WHERE id = $1 AND ticket_id = $2;', [commentId, ticketId]);
  } else {
    await pool.query('Delete FROM messages WHERE id = $1 AND ticket_id = $2 AND user_id = $3;', [commentId, ticketId, id]);
  }
  
  return res.status(200).json({
    status: "Deleted ticket comment."
  });
});
export default handler;