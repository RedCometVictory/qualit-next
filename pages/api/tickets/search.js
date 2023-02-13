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
    keyword, // title, or submitter
    status, // -- ['New','Open','On Hold','In Progress','Closed','Unconfirmed']
    priority, // -- ['Urgent','High','Medium','Low','None']
    type, // -- ['Bug','Breaking Change','Discussion','Error','Enhancement','Feature Request','Needs Investigation','Question','Release','Regression','Security','Misc']
    submitter, // USER ID OF SUBMITTER
    pageNumber,
    itemsPerPage, // offsetItems
    orderBy, // true = DESC (newest first) || false = ASC (oldest first)
    orderChoice // date = orderBy ticket creation || deadline = order by ticket deadline
  } = req.query;
  // let deadlineOrder = JSON.parse(deadline);
  let order = JSON.parse(orderBy);
  let page = Number(pageNumber);
  if (page < 1) page = 1;
  let limit = Number(itemsPerPage) || 20;
  let offset = (page - 1) * limit;
  let count;
  // let totalTickets;
  let myTickets;

  if (keyword && keyword.length > 0) keyword = keyword.trim();
  // DESC is newest first
  // TODO: status, prioroty, type are all select menus with their own appripriate options
  // TODO: can switch order of tickets by deadline, to see which tickets need to be finished in order of first or last addistionally you can fllip a switch for the search bar in order to search for submitter instead of keyword in title
  let mainSearchQuery, keywordQuery, orderQuery, statusQuery, priorityQuery, typeQuery, submittedQuery, deadlineQuery;
  // TODO: split string by $, iterate and place number and a space after $, then join
  /*
    ?? EXAMPLE
    try {
        const valuesInTheBody = Object.values(req.body);
        const numberOfValues = valuesInTheBody.length;
        const updateStatement = Object.entries(req.body).map(([key, value], i) => `${key}=$${i + 1}`).join(",")
        const query = `UPDATE product SET ${updateStatement}, updated_at='${moment().format("YYYY-MM-DD hh:mm:ss")}' 
                        WHERE prod_id=$${numberOfValues + 1} RETURNING *`
        const result = await db.query(query, [...valuesInTheBody, req.params.productId])
        res.send(result.rows[0])
    } catch (error) {
        console.log(error)
    }
  */
  let parametersUsed = [];
  if (role === "Developer" || role === "Project Manager") {
    parametersUsed.push(id);
    if (keyword === '' || keyword.length === 0 || !keyword) keywordQuery = ""
    if (keyword && keyword.length > 0) {
      keywordQuery = "AND title ILIKE '%'$X'%' ";
      parametersUsed.push(keyword);
    };

    if (!status) statusQuery = ""
    if (status) {
      statusQuery = "AND status = $X "
      parametersUsed.push(status);
    };

    if (!priority) priorityQuery = ""
    if (priority) {
      priorityQuery = "AND priority = $X "
      parametersUsed.push(priority);
    };

    if (!type) typeQuery = ""
    if (type) {
      typeQuery = "AND type = $X "
      parametersUsed.push(type);
    };

    if (!submitter) submittedQuery = ""
    if (submitter) {
      submittedQuery = "AND submitter = $X "
      parametersUsed.push(submitted);
    };

    parametersUsed.push(limit);
    parametersUsed.push(offset);

    console.log(mainSearchQuery);
    console.log(parametersUsed);
    // if searching by order of ticket creation date
    // orderchoice date = true
    if (orderChoice === 'date') {
      if (order) orderQuery = "ORDER BY created_at DESC LIMIT $X OFFSET $X;"
      if (!order) orderQuery = "ORDER BY created_at ASC LIMIT $X OFFSET $X;"
      mainSearchQuery = "SELECT * FROM tickets WHERE user_id = $X " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + orderQuery;
    }
    // if searching by order of ticket deadline date
    // orderchoice date = false
    if (orderChoice === 'deadline') {
      if (order) deadlineQuery = "ORDER BY deadline DESC LIMIT $X OFFSET $X;"
      if (!order) deadlineQuery = "ORDER BY deadline ASC LIMIT $X OFFSET $X;"
      mainSearchQuery = "SELECT * FROM tickets WHERE user_id = $X " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + deadlineQuery;
    }
    for (let i = 1; i <= parametersUsed.length; i++) {
      mainSearchQuery = mainSearchQuery.replace('$X', `$${i}`);
    };
    myTickets = await pool.query(mainSearchQuery, parametersUsed);
  };

  if (role === "Admin") {
    if (keyword === '' || keyword.length === 0 || !keyword) keywordQuery = ""
    if (keyword && keyword.length > 0) {
      keywordQuery = "title ILIKE '%'$X'%' ";
      parametersUsed.push(keyword);
    };

    if (!status) statusQuery = ""
    if (status) {
      if (parametersUsed.length > 0) {
        statusQuery = "AND status = $X "
      } else {
        statusQuery = "status = $X "
      };
      parametersUsed.push(status);
    };

    if (!priority) priorityQuery = ""
    if (priority) {
      if (parametersUsed.length > 0) {
        priorityQuery = "AND priority = $X "
      } else {
        priorityQuery = "priority = $X "
      };
      parametersUsed.push(priority);
    };

    if (!type) typeQuery = ""
    if (type) {
      if (parametersUsed.length > 0) {
        typeQuery = "AND type = $X "
      } else {
        typeQuery = "type = $X "
      };
      parametersUsed.push(type);
    };

    if (!submitter) submittedQuery = ""
    if (submitter) {
      if (parametersUsed.length > 0) {
        submittedQuery = "AND submitter = $X "
      } else {
        submittedQuery = "submitter = $X "
      };
      parametersUsed.push(submitted);
    };

    parametersUsed.push(limit);
    parametersUsed.push(offset);
    
    console.log(mainSearchQuery);
    console.log(parametersUsed);
    // if searching by order of ticket creation date
    // orderchoice date = true
    if (orderChoice === 'date') {
      mainSearchQuery = "SELECT * FROM tickets WHERE " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + orderQuery;
      if (order) orderQuery = "ORDER BY created_at DESC LIMIT $X OFFSET $X;"
      if (!order) orderQuery = "ORDER BY created_at ASC LIMIT $X OFFSET $X;"
    }
    // if searching by order of ticket deadline date
    // orderchoice date = false
    if (order) deadlineQuery = "ORDER BY deadline DESC LIMIT $X OFFSET $X;"
    if (!order) deadlineQuery = "ORDER BY deadline ASC LIMIT $X OFFSET $X;"
    if (orderChoice === 'deadline') {
      mainSearchQuery = "SELECT * FROM tickets WHERE " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + deadlineQuery;
    }
    for (let i = 1; i <= parametersUsed.length; i++) {
      mainSearchQuery = mainSearchQuery.replace('$X', `$${i}`);
    };
    myTickets = await pool.query(mainSearchQuery, parametersUsed);
  };

  for (let i = 0; i < myTickets.rows.length; i++) {
    myTickets.rows[i].deadline = singleISODate(myTickets.rows[i].deadline);
    myTickets.rows[i].created_at = singleISODate(myTickets.rows[i].created_at);
  };

  // count = totalTickets.rows[0].count;
  count = myTickets.rows.length;
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



/*
  if (order) {
    if (role === "Developer" || role === "Project Manager") {
      if (keyword.length > 0 && keyword) {
        let keywordTrimmed = keyword.trim();
        totalTickets = await pool.query('SELECT COUNT(id) FROM tickets WHERE user_id = $1;', [id]);
        projectTickets = await pool.query("SELECT * FROM tickets WHERE user_id = $1 AND title ILIKE $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4;", [id, '%' + keywordTrimmed + '%', limit, offset]);
      };
      if (keyword === '' || keyword.length === 0 || !keyword) {
        totalTickets = await pool.query('SELECT COUNT(id) FROM tickets WHERE user_id = $1;', [id]);
        projectTickets = await pool.query("SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;", [id, limit, offset]);
      };
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
  */