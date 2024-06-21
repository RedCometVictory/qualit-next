import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// update column data or sequence, sequence is '' if its not to be updated
// TODO: apply sequence to column to reflect change
handler.put(async (req, res) => {
  const { boardId, columnId } = req.query;
  // const { boardId } = req.query;
  // const { columnId, name } = req.body;
  console.log("PPPPPPPPPPPPPPPPPPPPPP")
  console.log("PPPPPPPPPPPPPPPPPPPPPP")
  console.log("updating column -> name")
  console.log("req.query")
  console.log(req.query)
  console.log("req.body")
  console.log(req.body)
  console.log("PPPPPPPPPPPPPPPPPPPPPP")
  console.log("PPPPPPPPPPPPPPPPPPPPPP")
  const { name } = req.body;

  //! TODO: Check if there is a name, then update if there is a change, else skip the name update

  let updatedByTimeStamp = new Date();
  let updatedColumn;
  
  updatedColumn = await pool.query('UPDATE columns SET name = $1, updated_at = $2 WHERE id = $3 RETURNING *;', [name, updatedByTimeStamp, columnId]);
  /*
  if (sequence.length === 0 || (!sequence || sequence === null)) {
    // update name of column
    updatedColumn = await pool.query('UPDATE columns SET name = $1, updated_at = $2 WHERE id = $3 RETURNING *;', [name, updatedByTimeStamp, columnId]);
  } else {
    // update sequence of column
    updatedColumn = await pool.query('UPDATE columns SET sequence = $1, updated_at = $2 WHERE id = $3 RETURNING *;', [sequence, updatedByTimeStamp, columnId]);
  };
  */
  if (updatedColumn.rowCount === 0 || updatedColumn === null) {
    throw new Error('Failed to update column.');
  }

  return res.status(200).json({
    status: "Success! Updated board.",
    data: {
      column: updatedColumn.rows[0]
    }
  });
});

// delete a column and its respective cards
// TODO: set admin to delete any board and user to only delete user owned boards and content
handler.delete(async (req, res) => {
  const { boardId, columnId } = req.query;
  console.log("^^^^^^^^^^^^^^^^^")
  console.log("^^^^^^^^^^^^^^^^^")
  console.log("deleting column")
  console.log("^^^^^^^^^^^^^^^^^")
  console.log("^^^^^^^^^^^^^^^^^")
  await pool.query('DELETE FROM cards WHERE column_id = $1;', [columnId]);
  await pool.query('DELETE FROM columns WHERE id = $1;', [columnId]);
  return res.status(200).json({
    status: "Deleted column."
  });
});
export default handler;