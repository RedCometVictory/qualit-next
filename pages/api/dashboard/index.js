import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: false }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// get a list of tickets for dashboard
handler.get(async (req, res) => {
  const { id, role } = req.user;
  let dashboardInfo;
  let myTickets;
  let myProjects;
  let myTicketsByPriority;
  let myTicketsByStatus;

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

  if (role === 'Developer') {
    // get all tickets assigned to && tickets belong to projects dev is working for
    // = pool.query('SELECT P.id, P.title, P.owner, P.created_at, T.id, T.title, T.type, T.created_at FROM projects AS P JOIN tickets AS T WHERE P.id = T.id LIMIT 25;', [slug]);
    // myProjects = pool.query("SELECT P.id, P.title, P.owner, P.created_at, M.status FROM projects JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned';", [id]);
    dashboardInfo = await pool.query(
      "SELECT P.id, P.title, P.owner, P.created_at, M.status FROM projects JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1 AND M.status = 'assigned';", [id]
    );
    // get all tickets assigned to you
    // myTickets = pool.query("SELECT id, title, type, created_at FROM tickets WHERE user_id = $1;", [id]);

    // if (myTickets.rowCount === 0 || myTickets === null) {};

    // get the status and priority values of the user based on their role - return the proper information, based on ticket id from myTickets
    // for (let i = 0; i < myTickets.rowCount; i++) {
    //   const ticketStatsQuery = "SELECT id, status, priority FROM tickets WHERE id = $1;";
    //   const ticketStatsProm = await queryPromise
    // };

  };
  if (role === 'Project Manager') {
    // ** original query
    // myProjects = pool.query("SELECT P.id, P.title, P.owner, P.created_at, M.status FROM projects JOIN members AS M ON P.id = M.project_id WHERE M.user_id = $1;", [id]);
    // ** this query combines three different tables
    // ** Project Manager gets project info that they are a member (as a manager) of and all of the tickets (from any developers) that belong to the projects they manage
    dashboardInfo = await pool.query(
      "SELECT P.id AS project_id, P.title AS project_title, P.owner AS project_owner, P.created_at AS project_created_at, M.user_id AS member_user_id, M.project_id AS member_project_id, M.status AS member_status, T.id AS ticket_id, T.title AS ticket_title, T.type AS ticket_type, T.priority AS ticket_priority, T.status AS ticket_status, T.created_at AS ticket_created_at FROM projects JOIN members AS M ON P.id = M.project_id JOIN tickets AS T ON T.project_id = P.id WHERE M.user_id = $1;", [id]
    );
    // loop through all project ids from myProjects, then collect all tickets with matching project_ids, thus collecting all tickets belonging to every project assigned to as manager
    // project_id_per_loop_iter_ = 1;
    // myTickets = ("SELECT id, title, type, created_at FROM tickets WHERE project_id = $1;", [project_id_per_loop_iter_]);
    // only gets tickets for projects they manage. They can view all tikcets assigned to any/all developers they assigned to a project they manage
    // = pool.query('SELECT P.id, P.title, P.owner, P.created_at, T.id, T.title, T.type, T.created_at FROM projects AS P JOIN tickets AS T WHERE P.id = T.project_id AND  LIMIT 25;', [slug]);
  };
  if (role === 'Admin') {
    // ** original queries
    myProjects = pool.query("SELECT id, title, owner, created_at FROM projects ORDER DESC;");
    myTickets = pool.query('SELECT id, title, type, created_at FROM tickets LIMIT 25;');
    // dashboardInfo = await pool.query(
      // "SELECT "
    // );
    // desc order means newest on top???
  };
  // if (columns.rowCount === 0 || columns === null) {
  //   throw new Error("Failed to get all columns belonging to this board.");
  // }

  return res.status(200).json({
    status: "Retrieved tickets.",
    data: {
      tickets: tickets.rows
    }
  });
});

handler.post(async (req, res) => {
  const { id } = req.user;
  const { slug } = req.query;
  const { name, sequence } = req.body;
  
  let newColumn = pool.query('INSERT INTO columns (name, sequence, board_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *;', [name, sequence, slug, id]);

  if (newColumn.rowCount === 0 || newColumn === null) {
    throw new Error('Failed to create new column.');
  }

  return res.status(201).json({
    status: "Success! Created new column.",
    data: {
      column: newColumn.rows[0]
    }
  });
});
export default handler;