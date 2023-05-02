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
  let personnelToAssign = [];
  let personnelToUnassign = [];
  let checkIfMemberQuery = "SELECT user_id FROM members WHERE user_id = $1 AND project_id = $2;";

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

  for (let i = 0; i < unassignedUsers.length; i++) {
    let confirmAssignedPromise = await queryPromise(checkIfMemberQuery, unassignedUsers[i].id, projectId);
    if (confirmAssignedPromise.rowCount === 1) personnelToUnassign.push(confirmAssignedPromise.rows[0]);
  };

  if (personnelToUnassign.length > 0) {
    for (let i = 0; i < personnelToUnassign.length; i++) {
      let unassignMemberQuery = "DELETE FROM members WHERE user_id = $1 AND project_id = $2;";
      unassignPersonnelPromise = await queryPromise(unassignMemberQuery, personnelToUnassign[i].user_id, projectId);
    };
  };
  // determine update for assigned users
  for (let i = 0; i < assignedUsers.length; i++) {
    checkingIfPersonnelPromise = await queryPromise(checkIfMemberQuery, assignedUsers[i].id, projectId);
    if (checkingIfPersonnelPromise.rowCount === 0) personnelToAssign.push(assignedUsers[i]);
  };
  
  if (personnelToAssign.length > 0) {
    for (let i = 0; i < personnelToAssign.length; i++) {
      const addProjectMemberQuery = "INSERT INTO members (status, user_id, project_id) VALUES ($1, $2, $3);";
      assigningPersonnelPromise = await queryPromise(addProjectMemberQuery, 'assigned', personnelToAssign[i].id, projectId);
    };
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