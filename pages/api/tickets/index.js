import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// get a list of tickets for dashboard
// TODO: this route may not be used
handler.get(async (req, res) => {
  const { role } = req.user;
  // const { slug } = req.query;
  let tickets;
  if (role === 'Developer') {
    myTickets = await pool.query('SELECT id, title, status, priority, type, created_at FROM tickets AS T WHERE P.id = T.id LIMIT 25;', [slug]);
    // get all tickets assigned to && tickets belong to projects dev is working for
    // = pool.query('SELECT * FROM tickets WHERE board_id = $1;', [slug]);
    // = pool.query('SELECT P.id, P.title, P.owner, P.created_at, T.id, T.title, T.type, T.created_at FROM projects AS P JOIN tickets AS T WHERE P.id = T.id LIMIT 25;', [slug]);
  };
  if (role === 'Project Manager') {
    // only gets tickets for projects they manage. They can view all tikcets assigned to any/all developers they assigned to a project they manage
    // = pool.query('SELECT P.id, P.title, P.owner, P.created_at, T.id, T.title, T.type, T.created_at FROM projects AS P JOIN tickets AS T WHERE P.id = T.project_id AND  LIMIT 25;', [slug]);
  };
  if (role === 'Admin') {
    // sleect all tickets from all projects
    tickets = pool.query('SELECT * FROM tickets LIMIT 25;');
    // desc order means newest on top???
    let projects = pool.query('SELECT * FROM projects LIMIT 25 ORDER DESC;');
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

// create ticket
handler.post(async (req, res) => {
  const { id, role } = req.user;
  const { projectId } = req.query;
  const { title, description, status, priority, type, deadline } = req.body; // ---
  
  if (role === "Developer") {
    throw new Error("Need sufficient authroization to create a ticket.")
  };

  let notes = [''];
  let submitter = id; // user id

  let newTicket = await pool.query('INSERT INTO tickets (title, description, notes, status, priority, type, submitter, deadline, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;', [title, description, notes, status, priority, type, submitter, deadline, projectId]);

  if (newTicket?.rowCount === 0 || newTicket === null) {
    throw new Error('Failed to create new ticket.');
  }

  return res.status(201).json({
    status: "Success! Created new ticket.",
    data: {
      tickets: newTicket.rows[0]
    }
  });
});
export default handler;