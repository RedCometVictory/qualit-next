import nc from 'next-connect';
import { removeOnErr } from '@/utils/cloudinary';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';
import { singleISODate } from '@/utils/toISODate';

// bodyParser needs to be set to true in order to properly post info to the backend
export const config = {
  // api: { bodyParser: true }
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
// handler.use(verifAuth, authRoleDev);
handler.use(verifAuth);

// ROUTE for getting projects based on user role
// TODO: perhaps delete this route - it may not be used aND GETTING projects is used via dashboard route
handler.get(async (req, res) => {
  const { id, role } = req.query;

  console.log("########## BACKEND ##########");
  console.log("|/\/\/\/\/\/\/\/\/\/\|")
  console.log("fetching my projects")
  console.log(req.query)
  console.log("|\/\/\/\/\/\/\/\/\/\/|")
  // If orderBy is true then the order of comments is newest first, thus psql DESC
  const {
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
  let totalProjects;
  let myProjects;

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
  
  // DESC is newest first
  // TODO: chenage query for project tickets per each user role type
  // TODO: re-edit queries for pagination
  if (order) {
    if (role === "Developer" || role === "Project Manager") {
      // TODO: perhaps count the total amount of tickets for each project
      // TODO: add search capability to find project by title or by owner name, place into /projects/search?keyword='project-title' api url - also keep pagination capabilities
      //  todo: search for tickets matching both user id of ticket and user id of project, refer to the connection made via the members table that connects a user as assigned to a project
      totalProjects = await pool.query("SELECT COUNT(P.id) FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned';", [id]);
      myProjects = await pool.query("SELECT P.id, P.title, P.owner, P.created_at, M.status FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned' ORDER BY P.created_at DESC LIMIT $2 OFFSET $3;", [id, limit, offset]);
    };
    if (role === "Admin") {
      totalProjects = await pool.query("SELECT COUNT(P.id) FROM projects;", [id]);
      // view all tickets
      projectTickets = await pool.query("SELECT * FROM projects ORDER BY created_at DESC LIMIT $1 OFFSET $2;", [limit, offset]);
    };
  };
  
  if (!order) {
    // project tickets for developers
    if (role === "Developer" || role === "Project Manager") {
      totalProjects = await pool.query("SELECT COUNT(P.id) FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned';", [id]);
      myProjects = await pool.query("SELECT P.id, P.title, P.owner, P.created_at, M.status FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned' ORDER BY P.created_at ASC LIMIT $2 OFFSET $3;", [id, limit, offset]);
    };
    if (role === "Admin") {
      totalProjects = await pool.query("SELECT COUNT(P.id) FROM projects;", [id]);
      // view all tickets
      projectTickets = await pool.query("SELECT * FROM projects ORDER BY created_at ASC LIMIT $1 OFFSET $2;", [limit, offset]);
    };
  };
  // add ticket count to projects list
  for (let i = 0; i < myProjects.rows.length; i++) {
    const ticketCountQuery = "SELECT COUNT(id) AS ticket_count FROM tickets WHERE project_id = $1;";
    myProjects.rows[i].created_at = singleISODate(myProjects.rows[i].created_at);
    const ticketCountPromise = await queryPromise(ticketCountQuery, myProjects.rows[i].id);
    myProjects.rows[i] = { ...myProjects.rows[i], ...ticketCountPromise.rows[0]}
  };

  count = totalProjects.rows[0].count;
  Number(count);
  return res.status(200).json({
    status: "Retrieved ticket comments.",
    data: {
      tickets: projectTickets.rows,
      page: page,
      pages: count
    }
  });
});
export default handler;