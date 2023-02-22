import nc from 'next-connect';
import { upload } from "@/utils/multer";
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

// ROUTE for getting tickets based on user role
// get essential ticket data
handler.get(async (req, res) => {
  const { id, role } = req.query;

  console.log("########## BACKEND ##########");
  console.log("|/\/\/\/\/\/\/\/\/\/\|")
  console.log("fetching my tickets")
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
  let totalTickets;
  let projectTickets;

  // DESC is newest first
  // TODO: chenage query for project tickets per each user role type
  // TODO: re-edit queries for pagination
  //  TODO: keep things simple - only look for tickets you personally own, as aproject manager you can view the tickets of the devs you manage by going to myProjects page and viewing the tickets from there - again as admin you access every thing
  if (order) {
    if (role === "Developer" || role === "Project Manager") {
      totalTickets = await pool.query('SELECT COUNT(id) FROM tickets WHERE user_id = $1;', [id]);
      // view all tickets assigned to
      projectTickets = await pool.query("SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;", [id, limit, offset]);
    };
    if (role === "Admin") {
      // view all tickets
      totalTickets = await pool.query('SELECT COUNT(id) FROM tickets;');
      projectTickets = await pool.query("SELECT * FROM tickets ORDER BY created_at DESC LIMIT $1 OFFSET $2;", [limit, offset]);
    };
  }
  
  if (!order) {
    if (role === 'Developer' || role === "Project Manager") {
      totalTickets = await pool.query('SELECT COUNT(id) FROM tickets WHERE user_id = $1;', [id]);
      projectTickets = await pool.query("SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at ASC LIMIT $2 OFFSET $3;", [id, limit, offset]);
    };
    if (role === "Admin") {
      totalTickets = await pool.query('SELECT COUNT(id) FROM tickets;');
      projectTickets = await pool.query("SELECT * FROM tickets ORDER BY created_at ASC LIMIT $1 OFFSET $2;", [limit, offset]);
    };
  };

  for (let i = 0; i < projectTickets.rows.length; i++) {
    projectTickets.rows[i].created_at = singleISODate(projectTickets.rows[i].created_at);
  };

  count = totalTickets.rows[0].count;
  Number(count);
  return res.status(200).json({
    status: "Retrieved ticket comments.",
    data: {
      tickets: myTickets.rows,
      page: page,
      pages: count
    }
  });
});
export default handler;