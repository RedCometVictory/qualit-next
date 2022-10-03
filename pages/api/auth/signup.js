import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import slug from 'slug';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { accessTokenGenerator, accessTokenCookieOptions } from '@/utils/jwtGenerator';
import { pool } from '@/config/db';

// needed to decrypt req.body (set to true), unless using serviced data - then leave value as false
// * may not need?
// export const config = {
//   api: { bodyParser: false }
// };

const handler = nc({onError, onNoMatch});

handler.post(async (req, res) => {
  let { firstName, lastName, username, email, password, password2 } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    throw new Error('All fields are required.');
  };

  if (password !== password2) {
    return res.status(400).send([{ errors: [{ msg: "Passwords do not match." }] }]);
  };

  if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof username !== 'string') {
    throw new Error('Invalid Credentials.');
  };

  if (!email || !email.includes('@')) {
    throw new Error('Invalid Credentials.')
  }

  // *** slug should be optional?, purpose is to remove emojis, perhaps apply to first or last names?
  // *** lower: false, means caps are not turned lowercase, all but numbers and letters are replaced via ' '
  firstName = slug(firstName, {replacement: ' ', lower: false});
  lastName = slug(lastName, {replacement: ' ', lower: false});
  username = slug(username, {replacement: ' ', lower: false});
  
  if (username.length > 20) {
    throw new Error('Error. Username must be less than 20 characters.');
  }
  
  if (firstName.length > 12) {
    throw new Error('Error. First name must be less than 12 characters.');
  }
  
  if (lastName.length > 20) {
    throw new Error('Error. Last name must be less than 20 characters.');
    // return res.status(400).json({ errors: [{ msg: 'Error. Last name must be less than 20 characters.' }] });
  }
  
  let emailResult = await pool.query('SELECT email FROM users WHERE email = $1;', [ email ]);
  let usernameResult = await pool.query('SELECT username FROM users WHERE username = $1;', [ username ]);
  
  if (usernameResult.rowCount !== 0 || emailResult.rowCount !== 0) {
    throw new Error('The username or email address already exists!');
  }

  let salt = await bcrypt.genSalt(11);
  let encryptedPassword = await bcrypt.hash(password, salt);
  
  let initRole = 'Developer';
  let newUser = await pool.query(
    'INSERT INTO users (f_name, l_name, username, email, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;', [firstName, lastName, username, email, encryptedPassword, initRole]
  );

  if (newUser.rowCount === 0 || !newUser) {
    return res.status(401).json({ errors: [{ msg: "Failed to register user." }] });
  }

  newUser.rows[0].password = undefined;

  const jwtAccessToken = accessTokenGenerator(newUser.rows[0].id, newUser.rows[0].role);
  // hide token from client (already added to db)
  let cookieOptions = accessTokenCookieOptions();

  res.setHeader(
    "Set-Cookie", [
      cookie.serialize("qual__token", jwtAccessToken, cookieOptions),
      cookie.serialize("qual__isLoggedIn", true, {path: "/"})
    ]
  );

  return res.status(201).json({
    status: "User registered!",
    data: { user: newUser.rows[0] }
  });
});
export default handler;