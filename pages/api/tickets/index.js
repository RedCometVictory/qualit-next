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
// handler.post(async (req, res) => {
//   const { id } = req.user;
//   const { slug } = req.query;
//   const { name, sequence } = req.body;
  
//   let newColumn = pool.query('INSERT INTO columns (name, sequence, board_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *;', [name, sequence, slug, id]);

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


// EXAMPLE of CREATING A TICKET
/*
INSERT INTO tickets (title, description, status, priority, type, user_id, project_id) VALUES ('Video Game Purchase', 'Many users have requested the ability to digitally donload the video game they rent. Consider building the link and the support for a download to take place once payment is collected.', 'On Hold', 'Low', 'Feature Request', '5179087c-68c0-4a9a-82bd-5fcb9c3e5f0e', '3af1df59-822c-495c-af9b-f5f7ed2d3772');
*/
export default handler;