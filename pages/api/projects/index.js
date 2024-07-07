import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// * create a new project
handler.post(async (req, res) => {
  const { id, role } = req.user;
  const { title, description, github_url, site_url } = req.body;
  let newProject;
  if (role === 'Developer' || role === 'Project Manager') {
    throw new Error("You are not authorized to create a new project. You must be an administrator.");
  }

  // if (role === 'Admin') {
  newProject = await pool.query('INSERT INTO projects (title, description, github_url, site_url, owner) VALUES ($1, $2, $3, $4, $5) RETURNING *;', [title, description, github_url, site_url, id]);

  if (newProject.rowCount === 0 || newProject === null) {
      throw new Error("Failed to create a new project.");
  }
  return res.status(200).json({
    status: "New project created.",
    data: {
      projects: newProject.rows[0]
    }
  });
});
export default handler;