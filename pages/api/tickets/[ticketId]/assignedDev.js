import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// update the developer assigned to a project
handler.put(async (req, res) => {
  const { id, role } = req.user;
  const { ticketId } = req.query;
  const { developer } = req.body;
  let updateTicketAssignment;
  let ticketAssignedDev;

  if (role === 'Developer') {
    throw new Error("You are not authorized to assign a ticket a new developer. You must be an Admin or Project Manager.");
  }

  updateTicketAssignment = await pool.query("UPDATE tickets SET user_id = $1 WHERE id = $2 RETURNING id, user_id;", [developer, ticketId]);

  if (updateTicketAssignment.rowCount === 0 || updateTicketAssignment === null) {
      throw new Error("Failed to update a new assigned user to ticket.");
  }

  ticketAssignedDev = await pool.query("SELECT f_name, l_name FROM users WHERE id = $1;", [updateTicketAssignment.rows[0].user_id]);

  let updatedUsername = ticketAssignedDev.rows[0].f_name + " " + ticketAssignedDev.rows[0].l_name;
  return res.status(200).json({
    status: "New project created.",
    data: {
      ticketId: updateTicketAssignment.rows[0].id,
      user_id: updateTicketAssignment.rows[0].user_id,
      assignedUser: updatedUsername
    }
  });
});
export default handler;