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

// accessed via getUserProfile()
handler.get(async (req, res) => {
  const { id, role } = req.user;
  const { userId } = req.query;

  // Labeled If Statement: Only Admin can edit unless you own your own acct you can edit
  userEdit: {
    if (role !== "Admin" && id === userId) {
      break userEdit;
    }
    if (role !== "Admin" && id !== userId) {
      throw new Error("You must be an administrator to view user information.");
    }
  };

  let userDetail;
  let userTickets; // tickets assigned
  let userProjects; // projects belong to as a member

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

  userDetail = await pool.query("SELECT id, f_name, l_name, username, email, role, created_at FROM users WHERE id = $1;", [userId]);

  if (userDetail.rowCount === 0 || userDetail === null) {
    throw new Error("Failed to find user information.");
  };

  userDetail.rows[0].created_at = singleISODate(userDetail.rows[0].created_at);

  userTickets = await pool.query("SELECT id, title, status, priority, type FROM tickets WHERE user_id = $1;", [userId]);

  userProjects = await pool.query("SELECT P.id, P.title, P.owner, M.status FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 ORDER BY P.created_at DESC;", [userId]);

  for (let i = 0; i < userProjects.rows.length; i++) {
    const projectOwnerQuery = "SELECT f_name, l_name FROM users WHERE id = $1;";
    const projectOwnerPromise = await queryPromise(projectOwnerQuery, userProjects.rows[i].owner);
    userProjects.rows[i] = { ...userProjects.rows[i], ...projectOwnerPromise.rows[0]}
  };

  return res.status(200).json({
    status: "Retrieved user information.",
    data: {
      user: {
        detail: userDetail.rows[0] ?? [],
        tickets: userTickets.rows ?? [],
        projects: userProjects.rows ?? []
      }
    }
  });
});

handler.put(async (req,res) => {
  const { id, role: mySetRole} = req.user;
  const { userId } = req.query;
  const { f_name, l_name, username, email, role } = req.body;

  let userDetail;
  let userFound;
  let updatedByTimeStamp = new Date();

  userEdit: {
    if (role === "Admin") {
      userFound = await pool.query("SELECT id FROM users WHERE id = $1;", [id]);
      break userEdit;
    }
    if (role !== "Admin" && id === userId) {
      userFound = await pool.query("SELECT id FROM users WHERE id = $1;", [id]);
      break userEdit;
    }
    if (mySetRole !== "Admin" && id !== userId) {
      throw new Error("Failed to find your account.");
    }
  };

  // if user is admin or owner of their own account then they can edit their account profile
  if (mySetRole === "Admin") {
    userDetail = await pool.query("UPDATE users SET f_name = $1, l_name = $2, username = $3, email = $4, role = $5, updated_at = $6 WHERE id = $7;", [f_name, l_name, username, email, role, updatedByTimeStamp, userId]);
  };
  
  // if not admin then updating own account, thus cannot change own role (unless admin)
  if (userFound.rowCount > 0 && mySetRole !== "Admin") {
    userDetail = await pool.query("UPDATE users SET f_name = $1, l_name = $2, username = $3, email = $4, updated_at = $5 WHERE id = $6;", [f_name, l_name, username, email, updatedByTimeStamp, userId]);
  };

  if (userDetail.rowCount === 0 || userDetail === null) {
    throw new Error("Failed to find an account.");
  };

  return res.status(201).json({
    status: "Updated user account information.",
    data: {
      user: userDetail.rows[0]
    }
  });
});
export default handler;