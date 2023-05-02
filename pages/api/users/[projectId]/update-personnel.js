// import nc from 'next-connect';
// import { onError, onNoMatch } from '@/utils/ncOptions';
// import { verifAuth, authRoleDev } from '@/utils/verifAuth';
// import { pool } from '@/config/db';
// import { singleISODate } from '@/utils/toISODate';

// export const config = {
//   api: { bodyParser: true }
// };

// const handler = nc({onError, onNoMatch});
// // handler.use(verifAuth, authRoleDev);
// handler.use(verifAuth);

// handler.post(async (req, res) => {
//   const { projectId } = req.query;
//   const { id, role } = req.user;
//   let { assignedUsers, unassignedUsers } = req.body;
//   let assignedPersonnel;
//   let unassignedPersonnel;
//   let checkingIfPersonnelPromise;
//   let assigningPersonnelPromise;
//   let unassignPersonnelPromise;

//   console.log("++++++++++BODY++++++++++++")
//   console.log(req.body)
//   console.log("++++++++++++++++++++++")
//   console.log("projectId")
//   console.log(projectId)
//   console.log("++++++++++++++++++++++")

//   const queryPromise = (query, ...values) => {
//     console.log("~~~~~~query values~~~~~~")
//     console.log("query")
//     console.log(query)
//     console.log("values")
//     console.log(values)
//     console.log("~~~~~~END~~~~~~")
//     return new Promise((resolve, reject) => {
//       pool.query(query, values, (err, res) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(res);
//         }
//       })
//     })
//   };

//   if (role !== 'Admin') {
//     throw new Error("You must be an administrator to manage users / project personnel.");
//   };

//   /*
//   {
//     assignedUsers: [
//       {
//         id: '11d371c4-0701-4361-b8f6-95187d1bd087',
//         f_name: 'Hause',
//         l_name: 'Master',
//         email: 'thehausealwayswins@mail.com',
//         username: 'HauseMaster',
//         role: 'Admin',
//         created_at: '2022-12-28'
//       },
//       {
//         id: '2fc4a7a6-e5ac-4566-82ef-46f8d538be71',
//         f_name: 'Momiji',
//         l_name: 'Inubashiri',
//         email: 'awooo123@mail.com',
//         username: 'woofy',
//         role: 'Admin',
//         created_at: '2022-12-28'
//       },
//       {
//         id: '5ef24164-30d2-485b-868f-ecbca20c5df0',
//         f_name: 'Chen',
//         l_name: 'Meow',
//         email: 'nyannyan@mail.com',
//         username: 'NyanNyan',
//         role: 'Developer',
//         created_at: '2022-12-28'
//       },
//       {
//         id: '5179087c-68c0-4a9a-82bd-5fcb9c3e5f0e',
//         f_name: 'Seiga',
//         l_name: 'Kaku',
//         email: 'hermit@mail.com',
//         username: 'Seiga NyanNyan',
//         role: 'Developer',
//         created_at: '2022-12-28'
//       }
//     ],
//     unassignedUsers: [
//       {
//         id: '18fd6896-3761-4669-9b29-3b0fed2f27eb',
//         f_name: 'Reimu',
//         l_name: 'Hakurei',
//         email: 'redbowgirl@mail.com',
//         username: 'redbowgirl',
//         role: 'Admin',
//         created_at: '2022-12-28'
//       },
//       {
//         id: '520cd56c-0ef2-4b4a-9596-2fc752a77d42',
//         f_name: 'Marissa',
//         l_name: 'Kirisame',
//         email: 'yellowwitch@mail.com',
//         username: 'yellowwitch',
//         role: 'Project Manager',
//         created_at: '2022-12-28'
//       },
//       {
//         id: '7afb132b-ee36-4b13-8524-d8fa39ef1ba9',
//         f_name: 'Ran',
//         l_name: 'Yakumo',
//         email: 'spinningfox@mail.com',
//         username: 'cheeen',
//         role: 'Project Manager',
//         created_at: '2022-12-28'
//       },
//       {
//         id: 'a333c870-f521-48ed-b3dc-2ee607845f62',
//         f_name: 'Kagerou',
//         l_name: 'Imaizumi',
//         email: 'flufwolf@mail.com',
//         username: 'WereGirl',
//         role: 'Developer',
//         created_at: '2022-12-28'
//       }
//     ]
//   }
//   */

//   // determine update for unassigned users, if previously assigned delete from members table
//   console.log("checking id developers are assigned to this project or not")
//   for (let i = 0; i < unassignedUsers.length; i++) {
//     // Chen
//     // query values
//     // [
//     //   '5ef24164-30d2-485b-868f-ecbca20c5df0',
//     //   '1d36fa0b-2ff8-4e22-a24c-9dce01c71c37'
//     // ]


//     let checkIfAssignedQuery = "SELECT user_id FROM members WHERE user_id = $1;";
//     // let checkIfAssignedQuery = "SELECT user_id FROM members WHERE user_id = $1 AND project_id = $2;";
//     let unassignMemberQuery = "DELETE FROM members WHERE user_id = $1 AND project_id = $2;";

//     // console.log("unassignedUsers[i].id")
//     // console.log(unassignedUsers[i].id)
//     // console.log("unassignedUsers[i].f_name")
//     // console.log(unassignedUsers[i].f_name)
//     let confirmAssignedPromise = await queryPromise(checkIfAssignedQuery, unassignedUsers[i].id);
//     // let confirmAssignedPromise = await queryPromise(checkIfAssignedQuery, unassignedUsers[i].id, projectId); // ---
//     console.log("^^^^^^confirmAssignedPromise^^^^^^")
//     console.log(confirmAssignedPromise.rows[i])
//     console.log("______confirmAssignedPromise______")
//     // if (confirmAssignedPromise?.rows[i]?.user_id.length > 0) { // ---
//     if (confirmAssignedPromise.rows[i]) { // ---
//     // if (confirmAssignedPromise?.rows[i]?.user_id.length === 0) {
//       // console.log("confirmAssignedPromise?.rows[i]?.user_id")
//       // console.log(confirmAssignedPromise?.rows[i]?.user_id)
//       // console.log("is already assigned")
//       // continue; // ---
//       console.log("-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-")
//       console.log("unassigning user")
//       console.log(unassignedUsers[i])
//       // unassignPersonnelPromise = await queryPromise(unassignMemberQuery, unassignedUsers[i].id, projectId);
//     } else {
//       console.log("**********user is not assigned to begin with**********")
//       console.log("unassignedUsers[i].id")
//       console.log(unassignedUsers[i].id)
//       console.log(unassignedUsers[i].f_name)
//       console.log("unassigning from project")
//       continue;
//       // unassignPersonnelPromise = await queryPromise(unassignMemberQuery, unassignedUsers[i].id, projectId); // ---
//     };
//   };

//   // TODO: currently cannot assign developers to a project, thewse developers have already been assigned to one project but cannot be assigned to another project...
//   // determine update for assigned users
//   for (let i = 0; i < assignedUsers.length; i++) {
//     const checkIfMemberQuery = "SELECT user_id FROM members WHERE user_id = $1 AND project_id = $2;";
//     const addProjectMemberQuery = "INSERT INTO members (status, user_id, project_id) VALUES ($1, $2, $3) RETURNING id, status, user_id, project_id, created_at;";
//     checkingIfPersonnelPromise = await queryPromise(checkIfMemberQuery, assignedUsers[i].id, projectId);
//     // if already a member, skip - regardless of status
//     // if (checkingIfPersonnelPromise.rows.length > 0) { // ---
//     if (checkingIfPersonnelPromise?.rows[i]?.user_id.length > 0) {
//       continue;
//     };
//     // assign to project
//     assigningPersonnelPromise = await queryPromise(addProjectMemberQuery, 'assigned', assignedUsers[i].id, projectId);
//   };

//   assignedPersonnel = await pool.query("SELECT U.id, U.f_name, U.l_name, U.email, U.username, U.role, U.created_at FROM users AS U JOIN members AS M ON U.id = M.user_id WHERE M.project_id = $1;", [projectId]);

//   unassignedPersonnel = await pool.query("SELECT U.id, U.f_name, U.l_name, U.email, U.username, U.role, U.created_at FROM users AS U WHERE NOT EXISTS (SELECT M.user_id FROM members AS M WHERE M.user_id = U.id AND M.project_id = $1);", [projectId]);

//   for (let i = 0; i < assignedPersonnel.rows.length; i++) {
//     assignedPersonnel.rows[i].created_at = singleISODate(assignedPersonnel.rows[i].created_at);
//   };

//   for (let i = 0; i < unassignedPersonnel.rows.length; i++) {
//     unassignedPersonnel.rows[i].created_at = singleISODate(unassignedPersonnel.rows[i].created_at);
//   };

//   return res.status(200).json({
//     status: "Updated personnel information.",
//     data: {
//       assignedUsers: assignedPersonnel.rows,
//       unassignedUsers: unassignedPersonnel.rows
//     }
//   });
// });
// export default handler;

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

  // // determine update for unassigned users
  // // let checkIfAssignedQuery = `SELECT user_id FROM members WHERE project_id = '${projectId}' AND user_id = $1;`;
  // // let checkIfAssignedQuery = "SELECT user_id FROM members WHERE user_id = $1 AND project_id = " + `'${projectId}'` + ";";
  // // let checkIfAssignedQuery = `SELECT user_id FROM members WHERE user_id = $1;`;
  // // checkIfAssignedQuery = checkIfAssignedQuery.toString();
  // // console.log("checkIfAssignedQuery")
  // // console.log(checkIfAssignedQuery)
  // for (let i = 0; i < unassignedUsers.length; i++) {
  //   let checkIfAssignedQuery = "SELECT user_id FROM members WHERE user_id = $1;";
  //   // console.log("looking at unassignedUser")
  //   // console.log(unassignedUsers[i].id)
  //   // console.log(unassignedUsers[i].f_name)
  //   // console.log("|||||||||START||||||||||")
  //   // let checkIfAssignedQuery = "SELECT user_id FROM members WHERE user_id = $1;"; // ----
  //   // TODO: so after testing it seems that a SELECT command cannot work with two or more $
  //   // * Potential Solution #1: 
  //   // let checkIfAssignedQuery = `SELECT user_id FROM members WHERE user_id = $1 AND project_id = '${projectId}';`;
  //   // checkIfAssignedQuery = checkIfAssignedQuery.toString();
  //   // console.log("checkIfAssignedQuery")
  //   // console.log(checkIfAssignedQuery)
  //   // * Potential Solution: 
  //   // let checkIfAssignedQuery = "SELECT user_id FROM members WHERE user_id = $1 AND project_id = $2;";
  //   // let checkIfAssignedQuery = "SELECT user_id FROM members WHERE user_id = $1 AND project_id = " + `'${projectId}'` + ";";
  //   let unassignMemberQuery = "DELETE FROM members WHERE user_id = $1;";
  //   let confirmAssignedPromise = await queryPromise(checkIfAssignedQuery, unassignedUsers[i].id);
  //   // let confirmAssignedPromise = await queryPromise(checkIfAssignedQuery, unassignedUsers[i].id, projectId);
  //   // console.log("confirmAssignedPromise")
  //   // console.log(confirmAssignedPromise.rows[i])
  //   console.log("_________________________")
  //   if (confirmAssignedPromise?.rows[i]?.user_id.length > 0) {
  //     // user is already unassigned
  //     console.log("continue.......................")
  //     continue;
  //   } else {
  //     console.log("user being unassigned")
  //     console.log(unassignedUsers[i].id)
  //     console.log(unassignedUsers[i].f_name)
  //     console.log("==========================")
  //     // unassignPersonnelPromise = await queryPromise(unassignMemberQuery, unassignedUsers[i].id);
  //   };
  // };
  let personnelToAssign = [];
  let personnelToUnassign = [];
  let checkIfMemberQuery = "SELECT user_id FROM members WHERE user_id = $1 AND project_id = $2;";
  for (let i = 0; i < unassignedUsers.length; i++) {
    let confirmAssignedPromise = await queryPromise(checkIfMemberQuery, unassignedUsers[i].id, projectId);
    console.log("confirmAssignedPromise")
    console.log(confirmAssignedPromise.rows)
    console.log("_________________________")
    console.log(confirmAssignedPromise.rowCount)
    console.log(unassignedUsers[i].id)
    console.log(unassignedUsers[i].f_name)
    console.log("==========================")
    if (confirmAssignedPromise.rowCount === 1) personnelToUnassign.push(confirmAssignedPromise.rows[0]);
  };

  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@")
  console.log("final result of unassigning")
  console.log(personnelToUnassign)

  // TODO: next, take the personnelToUnassgin arr and run it through the queryPromise
  if (personnelToUnassign.length > 0) {
    for (let i = 0; i < personnelToUnassign.length; i++) {
      let unassignMemberQuery = "DELETE FROM members WHERE user_id = $1 AND project_id = $2;";
      unassignPersonnelPromise = await queryPromise(unassignMemberQuery, personnelToUnassign[i].user_id, projectId);
    };
  };
  // determine update for assigned users
  // const checkIfMemberQuery = "SELECT user_id FROM members WHERE user_id = $1 AND project_id = $2;";
  for (let i = 0; i < assignedUsers.length; i++) {
    checkingIfPersonnelPromise = await queryPromise(checkIfMemberQuery, assignedUsers[i].id, projectId);
    console.log("checkingIfPersonnelPromise")
    console.log(checkingIfPersonnelPromise.rows)
    console.log("_________________________")
    console.log(checkingIfPersonnelPromise.rowCount)
    console.log(assignedUsers[i].id)
    console.log(assignedUsers[i].f_name)
    console.log("==========================")
    if (checkingIfPersonnelPromise.rowCount === 0) personnelToAssign.push(assignedUsers[i]);
  };
  
  if (personnelToAssign.length > 0) {
    for (let i = 0; i < personnelToAssign.length; i++) {
      // const addProjectMemberQuery = "INSERT INTO members (status, user_id, project_id) VALUES ($1, $2, $3) RETURNING id, status, user_id, project_id, created_at;";
      const addProjectMemberQuery = "INSERT INTO members (status, user_id, project_id) VALUES ($1, $2, $3);";
      assigningPersonnelPromise = await queryPromise(addProjectMemberQuery, 'assigned', personnelToAssign[i].id, projectId);
    };
  };
  
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@")
  console.log("final result of assigning")
  console.log(personnelToAssign)
  
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































































/* ORIGINAL VERSION
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
export default handler;*/