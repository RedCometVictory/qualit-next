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
// * get list of tickets for dashboard and get project details
handler.get(async (req, res) => {
  const { projectId } = req.query;
  const { id, role } = req.user;
  let projectDetails;
  // paginate tickets
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

  if (projectDetails.rowCount > 0) {
    // projectDetails.rows[0].created_at = singleISODate(projectDetails.rows[0].created_at);
    projectDetails.rows[0].updated_at = singleISODate(projectDetails.rows[0].updated_at);
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
  // for (let i = 0; i < ticketComments.rowCount; i++) {
  //   ticketUploadQuery = "SELECT * FROM uploads WHERE message_id = $1;";
  //   // combine upload with respective message
  //   const ticketUploadsPromise = await queryPromise(ticketUploadQuery, [ticketComments.rows[i].id]);
  //   ticketComments.rows[i] = {...ticketComments.rows[i], ...ticketUploadsPromise.rows[0]}
  // };
    
  // console.log("$$$$$$$$$$$$$$$$$$$$$$$")
  // console.log("final results")
  // console.log(projectDetails.rows)
  // console.log("$$$$$$$$$$$$$$$$$$$$$$$")
  // console.log(projectTickets.rows)
  // console.log("$$$$$$$$$$$$$$$$$$$$$$$")
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

handler.put(async (req, res) => {
  // const { id } = req.user;
  const { projectId } = req.query;
  const { title, description, github_url, site_url } = req.body;

  let updatedByTimeStamp = new Date();
  let updatedProject = await pool.query('UPDATE projects SET title = $1, description = $2, github_url = $3, site_url = $4, updated_at = $5 WHERE id = $6;', [title, description, github_url, site_url, updatedByTimeStamp, projectId]);

  if (updatedProject.rowCount === 0 || updatedProject === null) {
    throw new Error('Failed to update project.');
  }

  // if (updatedProject.rowCount > 0) {
  //   let updated_at = updatedProject.rows[0].updated_at;
  //   let newDate = singleISODate(updated_at);
  //   updatedProject.rows[0].updated_at = newDate;
  // };

  return res.status(201).json({
    status: "Success! Updated project.",
    data: {
      project: updatedProject.rows[0]
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