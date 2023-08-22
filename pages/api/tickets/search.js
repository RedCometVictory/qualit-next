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
  const { id, role } = req.user;

  console.log("########## BACKEND ##########");
  console.log("|/\/\/\/\/\/\/\/\/\/\|")
  console.log("fetching my tickets")
  console.log(req.query)
  console.log("|\/\/\/\/\/\/\/\/\/\/|")
  // If orderBy is true then the order of comments is newest first, thus psql DESC
  let {
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
  // let order = orderBy;
  let page = Number(pageNumber);
  if (page < 1) page = 1;
  let limit = Number(itemsPerPage) || 20;
  let offset = (page - 1) * limit;
  let count;
  let totalTickets;
  let parametersUsed = [];
  let keywordTrimmed;
  let myTickets;
  // submitter = '';
  console.log("+_+_+_+_+_+_+_+_+_+")
  console.log("page")
  console.log(page)
  console.log("limit")
  console.log(limit)
  console.log("order")
  console.log(order)
  console.log("orderChoice")
  console.log(orderChoice)

  if (keyword && keyword.length > 0) keywordTrimmed = keyword.trim();
  // DESC is newest first
  // TODO: status, prioroty, type are all select menus with their own appripriate options
  // TODO: can switch order of tickets by deadline, to see which tickets need to be finished in order of first or last addistionally you can fllip a switch for the search bar in order to search for submitter instead of keyword in title
  let mainSearchQuery, keywordQuery, orderQuery, statusQuery, priorityQuery, typeQuery, submittedQuery, deadlineQuery;
  
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

  console.log("beginning queries")
  if (role === "Developer" || role === "Project Manager") {
    parametersUsed.push(id);
    console.log("developer or PM")
    if (keyword === '' || keyword.length === 0 || !keyword) keywordQuery = ""
    if (keyword && keyword.length > 0) {
      keywordQuery = "AND title ILIKE $X ";
      parametersUsed.push('%' + keywordTrimmed + '%');
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

    // console.log(mainSearchQuery);
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
    // for (let i = 1; i <= parametersUsed.length; i++) {
    //   mainSearchQuery = mainSearchQuery.replace('$X', `$${i}`);
    // };
    // myTickets = await pool.query(mainSearchQuery, parametersUsed);
    console.log("mainSearchQuery");
    console.log(mainSearchQuery);
    // console.log("parametersUsed");
    // console.log(parametersUsed);
  };

  if (role === "Admin") {
    console.log("role is admin")
    console.log("checking keyword")
    if (keyword === '' || keyword.length === 0 || !keyword) keywordQuery = ""
    if (keyword && keyword.length > 0) {
      keywordQuery = "title ILIKE $X ";
      parametersUsed.push('%' + keywordTrimmed + '%');
    };

    console.log("checking status")
    if (status.length === 0 || !status) statusQuery = ""
    if (status) {
      if (parametersUsed.length > 0) {
        statusQuery = "AND status = $X "
      } else {
        statusQuery = "status = $X "
      };
      parametersUsed.push(status);
    };

    console.log("checking priority")
    if (status.length === 0 || !priority) priorityQuery = ""
    if (priority) {
      if (parametersUsed.length > 0) {
        priorityQuery = "AND priority = $X "
      } else {
        priorityQuery = "priority = $X "
      };
      parametersUsed.push(priority);
    };

    console.log("checking type")
    if (status.length === 0 || !type) typeQuery = ""
    if (type) {
      if (parametersUsed.length > 0) {
        typeQuery = "AND type = $X "
      } else {
        typeQuery = "type = $X "
      };
      parametersUsed.push(type);
    };

    console.log("checking aubmitter")
    if (status.length === 0 || !submitter) submittedQuery = ""
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
    
    // console.log("typeof order")
    // console.log(typeof order)
    // if searching by order of ticket creation date
    // orderchoice date = true
    console.log("mainSearchQuery - before orderChoice");
    console.log(mainSearchQuery);
    if (orderChoice === 'date') {
      if (order) orderQuery = "ORDER BY created_at DESC LIMIT $X OFFSET $X;"
      if (!order) orderQuery = "ORDER BY created_at ASC LIMIT $X OFFSET $X;"
      if (parametersUsed.length < 3) {
        mainSearchQuery = "SELECT * FROM tickets " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + orderQuery;
      } else {
        mainSearchQuery = "SELECT * FROM tickets WHERE " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + orderQuery;
      };
    }
    // if searching by order of ticket deadline date
    // orderchoice date = false
    if (orderChoice === 'deadline') {
      if (order) deadlineQuery = "ORDER BY deadline DESC LIMIT $X OFFSET $X;"
      if (!order) deadlineQuery = "ORDER BY deadline ASC LIMIT $X OFFSET $X;"
      if (parametersUsed.length < 3) {
        mainSearchQuery = "SELECT * FROM tickets " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + deadlineQuery;
      } else {
        mainSearchQuery = "SELECT * FROM tickets WHERE " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + deadlineQuery;
      };
    }
    // for (let i = 1; i <= parametersUsed.length; i++) {
    //   mainSearchQuery = mainSearchQuery.replace('$X', `$${i}`);
    // };
    // myTickets = await pool.query(mainSearchQuery, parametersUsed);
    // console.log(mainSearchQuery);
    // console.log(parametersUsed);
  };
  
  console.log("mainSearchQuery - before LOOP");
  console.log(mainSearchQuery);
  for (let i = 1; i <= parametersUsed.length; i++) {
    mainSearchQuery = mainSearchQuery.replace('$X', `$${i}`);
  };
  console.log("keywordQuery");
  console.log(keywordQuery);
  console.log("statusQuery");
  console.log(statusQuery);
  console.log("priorityQuery");
  console.log(priorityQuery);
  console.log("typeQuery");
  console.log(typeQuery);
  console.log("submittedQuery");
  console.log(submittedQuery);
  console.log("orderQuery");
  console.log(orderQuery);
  console.log("deadlineQuery");
  console.log(deadlineQuery);
  console.log("mainSearchQuery - after");
  console.log(mainSearchQuery);
  console.log("parametersUsed");
  console.log(parametersUsed);
  
  myTickets = await pool.query(mainSearchQuery, parametersUsed);
  console.log("my found tickets")
  // console.log(myTickets.rows[0])
  console.log(myTickets.rows)
  console.log(myTickets.rows.length)

  for (let i = 0; i < myTickets.rows.length; i++) {
    if (myTickets.rows[i].deadline) myTickets.rows[i].deadline = singleISODate(myTickets.rows[i].deadline);
    if (myTickets.rows[i].created_at) myTickets.rows[i].created_at = singleISODate(myTickets.rows[i].created_at);
  };

  if (role === "Developer" || role === "Project Manager") {
    totalTickets = await pool.query("SELECT COUNT(id) FROM tickets WHERE user_id = $1;", [id]);
  };
  if (role === "Admin") totalTickets = await pool.query("SELECT COUNT(id) FROM tickets;");

  for (let i = 0; i < myTickets.rows.length; i++) {
    const projectOwnerQuery = "SELECT f_name, l_name FROM users WHERE id = $1;";
    const projectOwnerPromise = await queryPromise(projectOwnerQuery, myTickets.rows[i].submitter);
    myTickets.rows[i] = { ...myTickets.rows[i], ...projectOwnerPromise.rows[0]}
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