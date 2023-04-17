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

/*
CREATE TABLE members(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- active BOOLEAN DEFAULT true NOT NULL,
  -- ['assigned','reassigned','removed']
  status VARCHAR(120),
  user_id UUID,
  project_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(project_id) REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NULL
);
*/
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
  assignedPersonnel = await pool.query("SELECT U.id, U.f_name, U.l_name, U.email, U.username, U.role FROM users AS U JOIN members AS M ON U.id = M.user_id WHERE M.project_id = $1;", [projectId])
  // select all users that do not match as members
  unassignedPersonnel = await pool.query("SELECT U.id, U.f_name, U.l_name, U.email, U.username, U.role FROM users AS U WHERE NOT EXISTS (SELECT M.user_id FROM members AS M WHERE M.user_id = U.id AND M.project_id = $1);", [projectId])

  let allMembers = await pool.query("SELECT * FROM members;");

  console.log("^^^^^^ALL MEMBERS^^^^^^")
  console.log(allMembers.rows)
  console.log("^^^^^^ALL USERS^^^^^^")
  console.log("allUsers.rowCount")
  console.log(allUsers.rowCount)
  console.log(allUsers.rows)
  console.log("^^^^^^assignedPersonnel.rows^^^^^^")
  console.log("assignedPersonnel.rowCount")
  console.log(assignedPersonnel.rowCount)
  console.log(assignedPersonnel.rows)
  console.log("^^^^^^unassignedPersonnel.rows^^^^^^")
  console.log(unassignedPersonnel.rows)

  return res.status(200).json({
    status: "Retrieved personnel information.",
    data: {
      users: allUsers.rows,
      assignedUsers: assignedPersonnel.rows,
      unassignedUsers: unassignedPersonnel.rows
    }
  });
});

// handler.post(async (req, res) => {
//   const { id } = req.user;
//   const { slug } = req.query;
//   const { name, sequence } = req.body;
  
//   let newColumn = await pool.query('INSERT INTO columns (name, sequence, board_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *;', [name, sequence, slug, id]);

//   if (newColumn.rowCount === 0 || newColumn === null) {
//     throw new Error('Failed to create new column.');
//   }

//   return res.status(201).json({
//     status: "Success! Created new column.",
//     data: {
//       column: newColumn.rows[0]
//     }
//   });
// });
export default handler;