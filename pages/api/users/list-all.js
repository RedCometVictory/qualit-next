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

// * get list of all users for users list page
handler.get(async (req, res) => {
  const { id, role } = req.user;
  const {
    keyword,
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
  let totalUsers;
  let allUsers;
  let keywordTrimmed;
  
  keyword && keyword.length > 0 ? keywordTrimmed = keyword : keywordTrimmed = '';

  if (role !== 'Admin') {
    throw new Error("You must be an administrator to manage users / project personnel.");
  };

  if (order) {
    if (keyword.length > 0 && keyword) {
      totalUsers = await pool.query("SELECT COUNT(id) FROM users WHERE f_name || l_name || username || email ILIKE $1;", ['%' + keywordTrimmed + '%']);
      allUsers = await pool.query("SELECT * FROM users WHERE f_name || l_name || username || email ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;", ['%' + keywordTrimmed + '%', limit, offset]);
    };
    if (keyword === '' || keyword.length === 0 || !keyword) {
      totalUsers = await pool.query("SELECT COUNT(id) FROM users;");
      allUsers = await pool.query("SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2;", [limit, offset]);
    };
  };

  if (!order) {
    if (keyword.length > 0 && keyword) {
      totalUsers = await pool.query("SELECT COUNT(id) FROM users WHERE f_name || l_name || username || email ILIKE $1;", ['%' + keywordTrimmed + '%']);
      allUsers = await pool.query("SELECT * FROM users WHERE f_name || l_name || username || email ILIKE $1 ORDER BY created_at ASC LIMIT $2 OFFSET $3;", ['%' + keywordTrimmed + '%', limit, offset]);
    };
    if (keyword === '' || keyword.length === 0 || !keyword) {
      totalUsers = await pool.query("SELECT COUNT(id) FROM users;");
      allUsers = await pool.query("SELECT * FROM users ORDER BY created_at ASC LIMIT $1 OFFSET $2;", [limit, offset]);
    };
  };

  if (allUsers.rowCount === 0 || allUsers === null) {
    throw new Error('Failed to fetch user list data.');
  };

  for (let i = 0; i < allUsers.rows.length; i++) {
    allUsers.rows[i].created_at = singleISODate(allUsers.rows[i].created_at);
  };

  count = totalUsers.rows[0].count;
  Number(count);
  return res.status(200).json({
    status: "Retrieved user list information.",
    data: {
      users: allUsers.rows,
      page: page,
      pages: count
    }
  });
});
export default handler;