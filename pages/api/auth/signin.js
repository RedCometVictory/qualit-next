import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import { pool } from '@/config/db';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { accessTokenGenerator, accessTokenCookieOptions } from '@/utils/jwtGenerator';

// export const config = {
//   api: { bodyParser: false }
// };
const handler = nc({onError, onNoMatch});

// POST /api/auth/login
// jwt secret placed inside of cookie
handler.post(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error('All fields are required.');
  };

  const user = await pool.query(
    'SELECT * FROM users WHERE email = $1;', [email]
  );

  if (user.rows.length === 0) {
    return res.status(400).json({ errors: [{ msg: "Invalid email or password."}] })
  }

  if (user.rows[0].role === 'Banned') {
    return res.status(400).json({ errors: [{ msg: "Account is banned / currently under review."}] });
  }

  let isMatch = true;
  // TODO: remove conditon unitl testing accounts are to be removed:
  if (password !== '123456') {
    // TODO: keep this bcrypt compare, but delete the if statement
    isMatch = await bcrypt.compare(
      password, user.rows[0].password
    );
  }

  user.rows[0].password = undefined;
  if (!isMatch) {
    return res.status(400).json({ errors: [{ msg: "Invalid email or password."}] });
  }

  // create access & refresh token, save refToken to db
  const jwtAccessToken = accessTokenGenerator(user.rows[0].id, user.rows[0].role);

  const cookieOptions = accessTokenCookieOptions();
  
  res.setHeader(
    "Set-Cookie", [
      cookie.serialize("qual__token", jwtAccessToken, cookieOptions),
      cookie.serialize("qual__isLoggedIn", true, {path: "/", sameSite: 'Lax'}),
      // cookie.serialize("qual__userRole", user.rows[0].role, {httpOnly: true, secure: true, path: "/"})
    ]
  );

  return res.status(201).json({
    status: "User logged in!",
    data: {
      user: user.rows[0]
    }
  });
});
export default handler;