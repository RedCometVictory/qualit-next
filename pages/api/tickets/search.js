// let id = 9786756453423;
// let roleIsDev = true;
// let keyword = "i"; // title or submitter
// /* let keyword = "change width of menu"; */
// /* let status; // -- ['New','Open','On Hold','In Progress','Closed','Unconfirmed'] */
// /* let status = "New"; */
// let priority; // -- ['Urgent','High','Medium','Low','None']
// /* let priority = "Urgent"; */
// let type; // -- ['Bug','Breaking Change','Discussion','Error','Enhancement','Feature Request','Needs Investigation','Question','Release','Regression','Security','Misc']
// /* let type = "Enhancement"; */
// let submitted;
// /* let submitted = "02389203784897-3498309-324U394"; // USER ID OF SUBMITTER */
// let order = true; // true is DESC - newest first by project created at date
// /* let order = false; */
// let deadline = true; // DESC - newest first - by deadline closest to current date first
// /* let deadline = false; */
// let pageNumber = 1;
// let itemsPerPage;
// /* let orderBy; // ticket creation data or by deadline */
// let orderChoice = true; // true = orderBy ticket created_at || deadline = order by ticket deadline
// /* let orderChoice = false; // false = deadline; let order = JSON.parse(orderBy); */
// let keywordQuery, statusQuery, priorityQuery, typeQuery, submittedQuery, orderQuery, deadlineQuery, mainSearchQuery;
// let page = Number(pageNumber);
// if (page < 1) page = 1;
// let limit = Number(itemsPerPage) || 20;
// let offset = (page - 1) * limit;
// let count;
// let totalTickets;
// let myTickets;
// let parametersUsed = [];

// if (roleIsDev) parametersUsed.push(id);

// if (keyword && keyword.length > 0) {
//   keywordQuery = "AND title ILIKE '%'$X'%' ";
//   parametersUsed.push(keyword);
// };
// if (keyword === '' || keyword.length === 0 || !keyword) keywordQuery = ""
    
//     // if (status) statusQuery = "AND status = " + status
// if (status) {
//   statusQuery = "AND status = $X "
//   parametersUsed.push(status);
// };
// if (!status) statusQuery = ""
    
//     // if (priority) priorityQuery = "AND priority = " + priority
// if (priority) {
//   priorityQuery = "AND priority = $X "
//   parametersUsed.push(priority);
// };
// if (!priority) priorityQuery = ""
    
//     // if (type) typeQuery = "AND type = " + type
// if (type) {
//   typeQuery = "AND type = $X "
//   parametersUsed.push(type);
// };
// if (!type) typeQuery = ""
//     // if (submitted) submittedQuery = "AND submitter = " + submitter
// if (submitted) {
//   submittedQuery = "AND submitter = $X "
//   parametersUsed.push(submitted);
// };
// if (!submitted) submittedQuery = ""

// parametersUsed.push(limit);
// parametersUsed.push(offset);
// if (order) orderQuery = "ORDER BY created_at DESC LIMIT $X OFFSET $X;"
// if (!order) orderQuery = "ORDER BY created_at ASC LIMIT $X OFFSET $X;"

// mainSearchQuery = "SELECT * FROM tickets WHERE user_id = $X " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + orderQuery;

// for (let i = 1; i <= parametersUsed.length; i++) {
//   mainSearchQuery = mainSearchQuery.replace('$X', `$${i}`);
// };

// console.log(mainSearchQuery);
// console.log(parametersUsed);
// /*

// if (deadline) deadlineQuery = "ORDER BY deadline DESC LIMIT $X OFFSET $X;"
// if (!deadline) deadlineQuery = "ORDER BY deadline ASC LIMIT $X OFFSET $X;"

//     // if searching by order of ticket creation date
//     if (orderChoice === 'date') {
//       mainSearchQuery = "SELECT * FROM tickets WHERE user_id = $X " + "AND title ILIKE '%'$X'%' " + "AND status = $X " + "AND priority = $X " + "AND type = $X " + "AND submitter = $X " + "ORDER BY created_at DESC LIMIT $X OFFSET $X;";
//       mainSearchQuery = "SELECT * FROM tickets WHERE user_id = $1 " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + orderQuery;

//       mainSearchQuery.split(' ');
//     } */
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
    keyword, // title, or submitter
    status, // -- ['New','Open','On Hold','In Progress','Closed','Unconfirmed']
    priority, // -- ['Urgent','High','Medium','Low','None']
    type, // -- ['Bug','Breaking Change','Discussion','Error','Enhancement','Feature Request','Needs Investigation','Question','Release','Regression','Security','Misc']
    submitter, // USER ID OF SUBMITTER
    deadline, // DESC - newest first - by deadline closest to current date first
    pageNumber,
    itemsPerPage, // offsetItems
    orderBy, // true = DESC (newest first) || false = ASC (oldest first)
    orderChoice // date = orderBy ticket creation || deadline = order by ticket deadline
  } = req.query;
  let order = JSON.parse(orderBy);
  let page = Number(pageNumber);
  if (page < 1) page = 1;
  let limit = Number(itemsPerPage) || 20;
  let offset = (page - 1) * limit;
  let count;
  let totalTickets;
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
  // if (keyword === '' || keyword.length === 0 || !keyword) keywordQuery = ""
  // if (keyword && keyword.length > 0) {
  //   keywordQuery = "AND title ILIKE '%'$X'%' ";
  //   parametersUsed.push(keyword);
  // };
      
  //     // if (status) statusQuery = "AND status = " + status
  // if (status) {
  //   statusQuery = "AND status = $X "
  //   parametersUsed.push(status);
  // };
  // if (!status) statusQuery = ""
      
  //     // if (priority) priorityQuery = "AND priority = " + priority
  // if (priority) {
  //   priorityQuery = "AND priority = $X "
  //   parametersUsed.push(priority);
  // };
  // if (!priority) priorityQuery = ""
      
  //     // if (type) typeQuery = "AND type = " + type
  // if (type) {
  //   typeQuery = "AND type = $X "
  //   parametersUsed.push(type);
  // };
  // if (!type) typeQuery = ""
  //     // if (submitted) submittedQuery = "AND submitter = " + submitter
  // if (submitted) {
  //   submittedQuery = "AND submitter = $X "
  //   parametersUsed.push(submitted);
  // };
  // if (!submitted) submittedQuery = ""

  // parametersUsed.push(limit);
  // parametersUsed.push(offset);
  // if (order) orderQuery = "ORDER BY created_at DESC LIMIT $X OFFSET $X;"
  // if (!order) orderQuery = "ORDER BY created_at ASC LIMIT $X OFFSET $X;"

  // mainSearchQuery = "SELECT * FROM tickets WHERE user_id = $X " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + orderQuery;

  // for (let i = 1; i <= parametersUsed.length; i++) {
  //   mainSearchQuery = mainSearchQuery.replace('$X', `$${i}`);
  // };

  // console.log(mainSearchQuery);
  // console.log(parametersUsed);
  /*
    if (deadline) deadlineQuery = "ORDER BY deadline DESC LIMIT $X OFFSET $X;"
    if (!deadline) deadlineQuery = "ORDER BY deadline ASC LIMIT $X OFFSET $X;"
    // if searching by order of ticket creation date
    if (orderChoice === 'date') {
      mainSearchQuery = "SELECT * FROM tickets WHERE user_id = $X " + "AND title ILIKE '%'$X'%' " + "AND status = $X " + "AND priority = $X " + "AND type = $X " + "AND submitter = $X " + "ORDER BY created_at DESC LIMIT $X OFFSET $X;";
      mainSearchQuery = "SELECT * FROM tickets WHERE user_id = $1 " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + orderQuery;

      mainSearchQuery.split(' ');
    }
  */  
  // ######################################
  // ######################################
  // ######################################
  // ######################################
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
    if (order) orderQuery = "ORDER BY created_at DESC LIMIT $X OFFSET $X;"
    if (!order) orderQuery = "ORDER BY created_at ASC LIMIT $X OFFSET $X;"
    if (deadline) deadlineQuery = "ORDER BY deadline DESC LIMIT $X OFFSET $X;"
    if (!deadline) deadlineQuery = "ORDER BY deadline ASC LIMIT $X OFFSET $X;"
  
    mainSearchQuery = "SELECT * FROM tickets WHERE user_id = $X " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + orderQuery;
  
    for (let i = 1; i <= parametersUsed.length; i++) {
      mainSearchQuery = mainSearchQuery.replace('$X', `$${i}`);
    };
  
    console.log(mainSearchQuery);
    console.log(parametersUsed);
    // if searching by order of ticket creation date
    // orderchoice date = true
    if (orderChoice === 'date') {
      mainSearchQuery = "SELECT * FROM tickets WHERE user_id = $X " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + orderQuery;
    }
    // if searching by order of ticket deadline date
    // orderchoice date = false
    if (orderChoice === 'deadline') {
      mainSearchQuery = "SELECT * FROM tickets WHERE user_id = $X " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + deadlineQuery;
    }

    myTickets = await pool.query(mainSearchQuery, parametersUsed);
  };

  if (role === "Admin") {
    // totalTickets = await pool.query('SELECT COUNT(id) FROM tickets;');
    // projectTickets = await pool.query("SELECT * FROM tickets ORDER BY created_at DESC LIMIT $1 OFFSET $2;", [limit, offset]);
    
    // totalTickets = await pool.query('SELECT COUNT(id) FROM tickets;');
    // projectTickets = await pool.query("SELECT * FROM tickets ORDER BY created_at ASC LIMIT $1 OFFSET $2;", [limit, offset]);
    if (keyword && keyword.length > 0) keywordQuery = "title ILIKE " + '%' + keyword + '%'
    if (keyword === '' || keyword.length === 0 || !keyword) keywordQuery = ""
    // TODO: check if previous condition exists (or check its string length) and if it exists add "AND " to the query of the next condition in the query
    // TODO: apply this if role is Admin check the length of parameters used for any existing params, if any exist then add AND to query
    if (keywordQuery.length > 0) {
      if (status) statusQuery = "AND status = " + status
      if (!status) statusQuery = ""
    } else {
      if (status) statusQuery = "status = " + status
      if (!status) statusQuery = ""
    };

    if (keywordQuery.length > 0 || statusQuery.length > 0) {
      if (priority) priorityQuery = "AND priority = " + priority
      if (!priority) priorityQuery = ""
    } else {
      if (priority) priorityQuery = "priority = " + priority
      if (!priority) priorityQuery = ""
    };

    if (keywordQuery.length > 0 || statusQuery.length > 0 || priorityQuery.length > 0) {
      if (type) typeQuery = "AND type = " + type
      if (!type) typeQuery = ""
    } else {
      if (type) typeQuery = "type = " + type
      if (!type) typeQuery = ""
    };

    if (keywordQuery.length > 0 || statusQuery.length > 0 || priorityQuery.length > 0 || typeQuery.length > 0) {
      if (submitted) submittedQuery = "AND submitter = " + submitter
      if (!submitted) submittedQuery = ""
    } else {
      if (submitted) submittedQuery = "submitter = " + submitter
      if (!submitted) submittedQuery = ""
    };

    if (order) orderQuery = "ORDER BY created_at DESC LIMIT $2 OFFSET $3;"
    if (!order) orderQuery = "ORDER BY created_at ASC LIMIT $2 OFFSET $3;"
    if (deadline) deadlineQuery = "ORDER BY deadline DESC LIMIT $2 OFFSET $3;"
    if (!deadline) deadlineQuery = "ORDER BY deadline ASC LIMIT $2 OFFSET $3;"

    // if searching by order of ticket creation date
    if (orderChoice === 'date') {
      mainSearchQuery = "SELECT * FROM tickets WHERE " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + orderQuery;
    }
    // if searching by order of ticket deadline date
    if (orderChoice === 'deadline') {
      mainSearchQuery = "SELECT * FROM tickets WHERE " + keywordQuery + statusQuery + priorityQuery + typeQuery + submittedQuery + deadlineQuery;
    }

    myTickets = await pool.query(mainSearchQuery, [limit, offset]);
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