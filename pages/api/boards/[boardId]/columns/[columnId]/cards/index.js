import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';
import { singleISODate } from '@/utils/toISODate';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// TODO --- seems that this get function may not be used
// get all cards belonging to respective columns and board
handler.get(async (req, res) => {
  const { boardId } = req.query;

  // const columns = pool.query('SELECT * FROM columns WHERE board_id = $1;', [boardId]);
  const cards = await pool.query('SELECT * FROM cards WHERE board_id = $1;', [boardId]);
  // if (columns.rowCount === 0 || columns === null) {
  //   throw new Error("Failed to get all columns belonging to this board.");
  // }
  if (cards.rowCount === 0 || cards === null) {
    throw new Error("Failed to get all cards belonging to this board.");
  }

  for (let i = 0; i < cards.rows.length; i++) {
    cards.rows[i].created_at = singleISODate(cards.rows[i].created_at);
    if (cards.rows[i].updated_at) {
      cards.rows[i].updated_at = singleISODate(cards.rows[i].updated_at);
    }
  };

  return res.status(200).json({
    status: "Retrieved board.",
    data: {
      // columns: columns.rows,
      cards: cards.rows
    }
  });
});

// create new card for column via board_id
handler.post(async (req, res) => {
  const { id } = req.user;
  const { boardId, columnId } = req.query;
  const { title, description, priority, type, sequence } = req.body;

  console.log("req.user")
  console.log(req.user)
  console.log("req.query")
  console.log(req.query)
  console.log("req.body")
  console.log(req.body)

  
  // let newColumn = await pool.query('INSERT INTO columns (name, sequence, board_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *;', [name, sequence, boardId, id]);
  
  let newCard = await pool.query('INSERT INTO cards (title, description, priority, type, sequence, board_id, column_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7 ,$8) RETURNING *;', [title, description, priority, type, sequence, boardId, columnId, id]);
  // let newCard = pool.query('INSERT INTO cards (board_id, column_id, user_id) VALUES ($1, $2, $3) RETURNING *;', [boardId, columnId, id]);

  console.log("--- newCard ---")
  console.log(newCard.rows)

  if (newCard.rowCount === 0 || newCard === null) {
    throw new Error('Failed to create new card.');
  }

  return res.status(201).json({
    status: "Success! Created new card.",
    data: {
      card: newCard.rows[0]
    }
  });
});


// delete all columns belonging to a board and all of the cards belonging to each column
// TODO: set admin to delete any board and user to only delete user owned boards and content
handler.delete(async (req, res) => {
  const { boardId } = req.query;

  await pool.query('DELETE FROM cards WHERE board_id = $1;', [boardId]);
  await pool.query('DELETE FROM columns WHERE board_id = $1;', [boardId]);
  return res.status(200).json({
    status: "Deleted all columns."
  });
});
export default handler;

/* TODO - TESTING OUT CARDS ARRAY
  cards: [
      {
        id: '10417996-0dca-4410-8600-c7ec2ac370d1',
        title: null,
        description: null,
        priority: null,
        type: null,
        sequence: null,
        board_id: 'f34993c2-e156-4be3-aa2d-3c688208d9ee',
        column_id: '227a3a4c-aeb3-4191-8d30-dbd78ac1720d',
        user_id: '18fd6896-3761-4669-9b29-3b0fed2f27eb',
        created_at: '2024-06-15T00:51:44.457Z',
        updated_at: null
      },
      {
        id: '7640ecab-fcd8-4ef6-bf5a-5fe2186d3fb5',
        title: null,
        description: null,
        priority: null,
        type: null,
        sequence: null,
        board_id: 'f34993c2-e156-4be3-aa2d-3c688208d9ee',
        column_id: '227a3a4c-aeb3-4191-8d30-dbd78ac1720d',
        user_id: '18fd6896-3761-4669-9b29-3b0fed2f27eb',
        created_at: '2024-06-15T00:52:28.107Z',
        updated_at: null
      },
      {
        id: '641add0d-9e3e-4622-8544-e97371483822',
        title: null,
        description: null,
        priority: null,
        type: null,
        sequence: null,
        board_id: 'f34993c2-e156-4be3-aa2d-3c688208d9ee',
        column_id: '227a3a4c-aeb3-4191-8d30-dbd78ac1720d',
        user_id: '18fd6896-3761-4669-9b29-3b0fed2f27eb',
        created_at: '2024-06-15T00:53:44.313Z',
        updated_at: null
      },
      {
        id: 'bf2df9eb-27c7-4b2e-9714-eac92830dc5c',
        title: null,
        description: null,
        priority: null,
        type: null,
        sequence: null,
        board_id: 'f34993c2-e156-4be3-aa2d-3c688208d9ee',
        column_id: 'e68363f9-5e92-49aa-90e7-af681d269770',
        user_id: '18fd6896-3761-4669-9b29-3b0fed2f27eb',
        created_at: '2024-06-15T00:54:10.903Z',
        updated_at: null
      },
      {
        id: 'fc1a5bad-55a4-4d8b-b1f5-62994aaa5708',
        title: null,
        description: null,
        priority: null,
        type: null,
        sequence: null,
        board_id: 'f34993c2-e156-4be3-aa2d-3c688208d9ee',
        column_id: '227a3a4c-aeb3-4191-8d30-dbd78ac1720d',
        user_id: '18fd6896-3761-4669-9b29-3b0fed2f27eb',
        created_at: '2024-06-15T00:56:53.257Z',
        updated_at: null
      },
      {
        id: '4df118e7-5b25-4802-b9d1-aba4886e1383',
        title: 'Add Title',
        description: '',
        priority: '',
        type: '',
        sequence: 1,
        board_id: 'f34993c2-e156-4be3-aa2d-3c688208d9ee',
        column_id: '227a3a4c-aeb3-4191-8d30-dbd78ac1720d',
        user_id: '18fd6896-3761-4669-9b29-3b0fed2f27eb',
        created_at: '2024-06-17T04:51:07.815Z',
        updated_at: null
      },
      {
        id: 'f64b2151-a057-4afe-8c5f-3311482eaf1b',
        title: 'Add Title',
        description: '',
        priority: '',
        type: '',
        sequence: 1,
        board_id: 'f34993c2-e156-4be3-aa2d-3c688208d9ee',
        column_id: 'ea9075d2-fd12-4971-9588-2bcfca95ecee',
        user_id: '18fd6896-3761-4669-9b29-3b0fed2f27eb',
        created_at: '2024-06-17T05:54:51.255Z',
        updated_at: null
      },
      {
        id: 'cbed98f7-8d57-42f8-a244-f2501b915b49',
        title: 'Add Title',
        description: '',
        priority: '',
        type: '',
        sequence: 1,
        board_id: 'f34993c2-e156-4be3-aa2d-3c688208d9ee',
        column_id: 'e68363f9-5e92-49aa-90e7-af681d269770',
        user_id: '18fd6896-3761-4669-9b29-3b0fed2f27eb',
        created_at: '2024-06-17T05:54:57.159Z',
        updated_at: null
      },
      {
        id: '2f560059-7b12-49aa-ab60-0dd6b8885e67',
        title: 'Add Title',
        description: '',
        priority: '',
        type: '',
        sequence: 1,
        board_id: 'f34993c2-e156-4be3-aa2d-3c688208d9ee',
        column_id: '227a3a4c-aeb3-4191-8d30-dbd78ac1720d',
        user_id: '18fd6896-3761-4669-9b29-3b0fed2f27eb',
        created_at: '2024-06-17T06:10:18.531Z',
        updated_at: null
      },
      {
        id: '8b19b5ae-9458-48de-bf2c-8fdc18c97659',
        title: 'Add Title',
        description: '',
        priority: '',
        type: '',
        sequence: 1,
        board_id: 'f34993c2-e156-4be3-aa2d-3c688208d9ee',
        column_id: 'ea9075d2-fd12-4971-9588-2bcfca95ecee',
        user_id: '18fd6896-3761-4669-9b29-3b0fed2f27eb',
        created_at: '2024-06-17T06:13:52.566Z',
        updated_at: null
      }
    ]

*/