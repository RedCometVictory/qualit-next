import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import { pool } from '@/config/db';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth } from "@/utils/verifAuth";
import { accessTokenGenerator, accessTokenCookieOptions } from '@/utils/jwtGenerator';

// export const config = {
//   api: { bodyParser: false }
// };
const handler = nc({onError, onNoMatch});
handler.use(verifAuth);

// GET /api/auth/checkAuth
// check the role of user to see is authorized to access page
handler.get(async (req, res) => {
  const { id, role } = req.user;

  // const user = await pool.query(
  //   'SELECT role FROM users WHERE id = $1;', [id]
  // );

  // if (user.rows.length === 0) {
  //   return res.status(400).json({ errors: [{ msg: "Invalid email or password."}] })
  // }

  return res.status(201).json({
    status: "User role found!",
    data: {
      role: role
    }
  });
});
export default handler;