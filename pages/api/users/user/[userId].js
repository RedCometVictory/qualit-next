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
  const { userId } = req.query;

  console.log("00000000000000000000000000000")
  console.log("00000000000000000000000000000")
  console.log("00000000000000000000000000000")
  console.log("00000000000000000000000000000")
  if (role !== 'Admin') {
    throw new Error("You must be an administrator to view user information.");
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

  // TODO: take userProjects, search for users table matching user id for the user whom submitted the project, then as=dd result to userProjectsa
  for (let i = 0; i < userProjects.rows.length; i++) {
    // const ticketCountQuery = "SELECT COUNT(id) AS ticket_count FROM tickets WHERE project_id = $1;";
    const projectOwnerQuery = "SELECT f_name, l_name FROM users WHERE id = $1;";
    // myProjects.rows[i].created_at = singleISODate(myProjects.rows[i].created_at);
    // const ticketCountPromise = await queryPromise(ticketCountQuery, myProjects.rows[i].id);
    const projectOwnerPromise = await queryPromise(projectOwnerQuery, userProjects.rows[i].owner);
    userProjects.rows[i] = { ...userProjects.rows[i], ...projectOwnerPromise.rows[0]}
  };

  console.log(userDetail.rows[0])
  console.log(userTickets.rows[0])
  console.log(userProjects.rows[0])
  console.log("555555555")

  return res.status(200).json({
    status: "Retrieved user information.",
    data: {
      // user: userDetail.rows[0]
      user: {
        detail: userDetail.rows[0] ?? [],
        tickets: userTickets.rows ?? [],
        projects: userProjects.rows ?? []
      }
    }
  });
});
export default handler;