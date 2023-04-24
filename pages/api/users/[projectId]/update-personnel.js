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

handler.post(async (req, res) => {
  const { projectId } = req.query;
  const { id, role } = req.user;
  let { assignedUsers, unassignedUsers } = req.body;
  let assignedPersonnel;
  let unassignedPersonnel;
  let checkingIfPersonnelPromise;
  let assigningPersonnelPromise;
  let unassignPersonnelPromise;

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

  if (role !== 'Admin') {
    throw new Error("You must be an administrator to manage users / project personnel.");
  };

  // determine update for unassigned users
  for (let i = 0; i < unassignedUsers.length; i++) {
    let checkIfAssignedQuery = "SELECT user_id FROM members WHERE user_id = $1;";
    let unassignMemberQuery = "DELETE FROM members WHERE user_id = $1;";
    let confirmAssignedPromise = await queryPromise(checkIfAssignedQuery, unassignedUsers[i].id);
    if (confirmAssignedPromise?.rows[i]?.user_id.length > 0) {
      continue;
    } else {
      unassignPersonnelPromise = await queryPromise(unassignMemberQuery, unassignedUsers[i].id);
    };
  };

  // determine update for assigned users
  for (let i = 0; i < assignedUsers.length; i++) {
    const checkIfMemberQuery = "SELECT user_id FROM members WHERE user_id = $1;";
    const addProjectMemberQuery = "INSERT INTO members (status, user_id, project_id) VALUES ($1, $2, $3) RETURNING id, status, user_id, project_id, created_at;";
    checkingIfPersonnelPromise = await queryPromise(checkIfMemberQuery, assignedUsers[i].id);
    // if already a member, skip - regardless of status
    if (checkingIfPersonnelPromise.rows.length > 0) {
      continue;
    };
    // assign to project
    assigningPersonnelPromise = await queryPromise(addProjectMemberQuery, 'assigned', assignedUsers[i].id, projectId);
  };

  assignedPersonnel = await pool.query("SELECT U.id, U.f_name, U.l_name, U.email, U.username, U.role, U.created_at FROM users AS U JOIN members AS M ON U.id = M.user_id WHERE M.project_id = $1;", [projectId]);

  unassignedPersonnel = await pool.query("SELECT U.id, U.f_name, U.l_name, U.email, U.username, U.role, U.created_at FROM users AS U WHERE NOT EXISTS (SELECT M.user_id FROM members AS M WHERE M.user_id = U.id AND M.project_id = $1);", [projectId]);

  for (let i = 0; i < assignedPersonnel.rows.length; i++) {
    assignedPersonnel.rows[i].created_at = singleISODate(assignedPersonnel.rows[i].created_at);
  };

  for (let i = 0; i < unassignedPersonnel.rows.length; i++) {
    unassignedPersonnel.rows[i].created_at = singleISODate(unassignedPersonnel.rows[i].created_at);
  };

  return res.status(200).json({
    status: "Updated personnel information.",
    data: {
      assignedUsers: assignedPersonnel.rows,
      unassignedUsers: unassignedPersonnel.rows
    }
  });
});
export default handler;