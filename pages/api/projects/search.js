import nc from 'next-connect';
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

// * ROUTE for getting / paginating projects based on user role
handler.get(async (req, res) => {
  const { id, role } = req.user;

  const {
    keyword,
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
  let keywordTrimmed;
  
  keyword && keyword.length > 0 ? keywordTrimmed = keyword : keywordTrimmed = '';

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
  
  if (keyword.length > 0 && keyword) keywordTrimmed = keyword.trim();
  // DESC is newest first
  if (order) {
    if (role === "Developer" || role === "Project Manager") { 
      if (keyword.length > 0 && keyword) {
        totalProjects = await pool.query("SELECT COUNT(P.id) FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned' AND title ILIKE $2;", [id, '%' + keywordTrimmed + '%']);
        myProjects = await pool.query("SELECT P.id, P.title, P.description, P.github_url, P.site_url, P.owner, P.created_at, M.status FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned' AND title ILIKE $2 ORDER BY P.created_at DESC LIMIT $3 OFFSET $4;", [id, '%' + keywordTrimmed + '%', limit, offset]);
      };
      if (keyword === '' || keyword.length === 0 || !keyword) {
        totalProjects = await pool.query("SELECT COUNT(P.id) FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned';", [id]);
        myProjects = await pool.query("SELECT P.id, P.title, P.description, P.github_url, P.site_url, P.owner, P.created_at, M.status FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned' ORDER BY P.created_at DESC LIMIT $2 OFFSET $3;", [id, limit, offset]);
      };
    };
    if (role === "Admin") {
      if (keyword.length > 0 && keyword) {
        totalProjects = await pool.query("SELECT COUNT(id) FROM projects WHERE title ILIKE $1;", ['%' + keywordTrimmed + '%']);
        myProjects = await pool.query("SELECT * FROM projects WHERE title ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;", ['%' + keywordTrimmed + '%', limit, offset]);
      };
      if (keyword === '' || keyword.length === 0 || !keyword) {
        totalProjects = await pool.query("SELECT COUNT(id) FROM projects;");
        myProjects = await pool.query("SELECT * FROM projects ORDER BY created_at DESC LIMIT $1 OFFSET $2;", [limit, offset]);
      };
    };
  };
  
  if (!order) {
    // project tickets for developers
    if (role === "Developer" || role === "Project Manager") {
      if (keyword.length > 0 && keyword) {
        totalProjects = await pool.query("SELECT COUNT(P.id) FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned' AND title ILIKE $2;", [id, '%' + keywordTrimmed + '%']);
        myProjects = await pool.query("SELECT P.id, P.title, P.description, P.github_url, P.site_url, P.owner, P.created_at, M.status FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned' AND title ILIKE $2 ORDER BY P.created_at ASC LIMIT $3 OFFSET $4;", [id, '%' + keywordTrimmed + '%', limit, offset]);
      };
      if (keyword === '' || keyword.length === 0 || !keyword) {
        totalProjects = await pool.query("SELECT COUNT(P.id) FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned';", [id]);
        myProjects = await pool.query("SELECT P.id, P.title, P.description, P.github_url, P.site_url, P.owner, P.created_at, M.status FROM projects AS P JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned' ORDER BY P.created_at ASC LIMIT $2 OFFSET $3;", [id, limit, offset]);
      };
    };
    if (role === "Admin") {
      if (keyword.length > 0 && keyword) {
        totalProjects = await pool.query("SELECT COUNT(id) FROM projects WHERE title ILIKE $1;", ['%' + keywordTrimmed + '%']);
        myProjects = await pool.query("SELECT * FROM projects WHERE title ILIKE $1 ORDER BY created_at ASC LIMIT $2 OFFSET $3;", ['%' + keywordTrimmed + '%', limit, offset]);
      };
      if (keyword === '' || keyword.length === 0 || !keyword) {
        totalProjects = await pool.query("SELECT COUNT(id) FROM projects;");
        myProjects = await pool.query("SELECT * FROM projects ORDER BY created_at ASC LIMIT $1 OFFSET $2;", [limit, offset]);
      };
    };
  };
  // add ticket count to projects list
  for (let i = 0; i < myProjects.rows.length; i++) {
    const ticketCountQuery = "SELECT COUNT(id) AS ticket_count FROM tickets WHERE project_id = $1;";
    const projectOwnerQuery = "SELECT f_name, l_name FROM users WHERE id = $1;";
    myProjects.rows[i].created_at = singleISODate(myProjects.rows[i].created_at);
    const ticketCountPromise = await queryPromise(ticketCountQuery, myProjects.rows[i].id);
    const projectOwnerPromise = await queryPromise(projectOwnerQuery, myProjects.rows[i].owner);
    myProjects.rows[i] = { ...myProjects.rows[i], ...ticketCountPromise.rows[0], ...projectOwnerPromise.rows[0]}
  };

  count = totalProjects.rows[0].count;
  Number(count);
  return res.status(200).json({
    status: "Retrieved ticket comments.",
    data: {
      projects: myProjects.rows,
      page: page,
      pages: count
    }
  });
});
export default handler;