// TODO: consider deleting this file as it isi not used
import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';
import { singleISODate } from '@/utils/toISODate';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
// handler.use(verifAuth, authRoleDev);
handler.use(verifAuth);

// * get list of users for assignment and project details
// additionally get a list of all users currently assigned to the project for de-assignment
handler.get(async (req, res) => {
  const { projectId } = req.query;
  const { id, role } = req.user;
  let projectDetails;
  let assignedUsers;
  // let paginate tickets
  let projectTickets;
  let totalTickets;
  let count;

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

  projectDetails = await pool.query("SELECT * FROM projects WHERE id = $1;", [projectId]);

  if (projectDetails.rowCount > 0) {
    let created_at = projectDetails.rows[0].created_at;
    let newDate = singleISODate(created_at);
    projectDetails.rows[0].created_at = newDate;
  };

  totalTickets = await pool.query('SELECT COUNT(id) FROM tickets WHERE project_id = $1;', [projectId]);

  count = totalTickets.rows[0].count;
  Number(count);
  
  projectTickets = await pool.query("SELECT * FROM tickets WHERE project_id = $1;", [projectId]);
  
  if (projectTickets.rowCount > 0) {
    for (let i = 0; i < projectTickets.rows.length; i++) {
      let created_at = projectTickets.rows[i].created_at;
      let newDate = singleISODate(created_at);
      projectTickets.rows[i].created_at = newDate;
    };
  };

  return res.status(200).json({
    status: "Retrieved dashboard information.",
    data: {
      project: projectDetails.rows[0],
      tickets: projectTickets.rows,
      page: 1,
      pages: count
    }
  });
});
export default handler;