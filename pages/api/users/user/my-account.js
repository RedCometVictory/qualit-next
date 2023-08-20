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

handler.get(async (req, res) => {
  const { id, role } = req.user;

  let userDetail = await pool.query("SELECT id, f_name, l_name, username, email, role, created_at FROM users WHERE id = $1;", [id]);

  if (userDetail.rowCount === 0 || userDetail === null) {
    throw new Error("Failed to find user information.");
  };

  userDetail.rows[0].created_at = singleISODate(userDetail.rows[0].created_at);

  console.log(userDetail.rows[0])
  console.log("555555555")

  return res.status(200).json({
    status: "Retrieved user information.",
    data: {
      user: userDetail.rows[0]
    }
  });
});
export default handler;