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

// GET /api/auth/demo/admin
// jwt secret placed inside of cookie
handler.get(async (req, res) => {
  let EMAIL = process.env.DEMO_EMAIL;
  let PASSWORD = process.env.DEMO_PASSWORD;

  console.log("++++++++++++++++++++++++++++++")
  console.log("++++++++++++++++++++++++++++++")
  console.log("Email")
  console.log(EMAIL)
  console.log("password")
  console.log(PASSWORD)
  const user = await pool.query(
    'SELECT * FROM users WHERE email = $1;', [EMAIL]
  );

  console.log("user")
  console.log(user)
  if (user.rows.length === 0) {
    return res.status(400).json({ errors: [{ msg: "Invalid email or password."}] })
  }

  if (user.rows[0].role === 'Banned') {
    return res.status(400).json({ errors: [{ msg: "Account is banned / currently under review."}] });
  }

  const isMatch = await bcrypt.compare(
    PASSWORD, user.rows[0].password
  );

  user.rows[0].password = undefined;
  console.log("ismatch")
  console.log(isMatch)
  if (!isMatch) {
    return res.status(400).json({ errors: [{ msg: "Invalid email or password."}] });
  }
  
  // create access & refresh token, save refToken to db
  const jwtAccessToken = accessTokenGenerator(user.rows[0].id, user.rows[0].role);

  const cookieOptions = accessTokenCookieOptions();
  console.log("++++++++++++++++++++++++++++++")
  console.log("++++++++++++++++++++++++++++++")
  res.setHeader(
    "Set-Cookie", [
      cookie.serialize("qual__token", jwtAccessToken, cookieOptions),
      cookie.serialize("qual__isLoggedIn", true, {path: "/", sameSite: 'Lax'}),
      // cookie.serialize("qual__userRole", user.rows[0].role, {httpOnly: true, secure: true, path: "/"})
    ]
  );

  return res.status(201).json({
    status: "Demo user logged in!",
    data: {
      user: user.rows[0]
    }
  });
});
export default handler;