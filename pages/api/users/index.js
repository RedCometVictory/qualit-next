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

// * get list of all, assigned, and unassigned users for project details page
handler.get(async (req, res) => {
  const { projectId } = req.query;
  const { id, role } = req.user;
  let projectDetails;
  let allUsers;
  let assignedPersonnel;
  let unassignedPersonnel;
  
  if (role !== 'Admin') {
    throw new Error("You must be an administrator to manage users / project personnel.");
  }
  allUsers = await pool.query("SELECT * FROM users;");
  assignedPersonnel = await pool.query("SELECT U.id, U.f_name, U.l_name, U.email, U.username, U.role, U.created_at FROM users AS U JOIN members AS M ON U.id = M.user_id WHERE M.project_id = $1;", [projectId])

  // select all users that do not match as members
  unassignedPersonnel = await pool.query("SELECT U.id, U.f_name, U.l_name, U.email, U.username, U.role FROM users AS U WHERE NOT EXISTS (SELECT M.user_id FROM members AS M WHERE M.user_id = U.id AND M.project_id = $1);", [projectId])

  // let allMembers = await pool.query("SELECT * FROM members;");

  return res.status(200).json({
    status: "Retrieved personnel information.",
    data: {
      users: allUsers.rows,
      assignedUsers: assignedPersonnel.rows,
      unassignedUsers: unassignedPersonnel.rows
    }
  });
});
export default handler;