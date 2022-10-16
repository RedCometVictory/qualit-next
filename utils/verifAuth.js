import jwt from 'jsonwebtoken';
// require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifAuth = async (req, res, next) => {
  const { qual__token } = req.cookies;
  console.log("req.cookies")
  console.log(req.cookies)
  if (!qual__token) {
    // return res.status(401).json({ error: "No token. Authorization denied" });
    return res.status(401).send("No token or auth cookie. Authorization denied.");
  };

  try {
    jwt.verify(qual__token, JWT_SECRET, (err, decoded) => {
      if (err) {
        // return res.status(401).json({ errors: [{ msg: "User unauthenticated." }] });
        return res.status(401).send("User unauthenticated.");
      } else {
        req.user = decoded.user;
        next();
      };
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Sever Error. ${err.message}`);
  }
};

// 'Admin', 'Developer', 'Submitter', 'Project Manager', 'Banned', 'Deleted'
const authRoleAdmin = (req, res, next) => {
  const { role } = req.user;
  if (req.user && role === 'Admin') {
    next();
  } else {
    return res.status(401).json({ errors: [{ msg: "Authorization denied" }] });
  };
};

const authRoleDev = (req, res, next) => {
  const { role } = req.user;
  console.log("@@@@@ Checking user role @@@@@")
  console.log(role)
  console.log("----role----end")
  if (req.user && (role === 'Developer' || role === 'Admin')) {
    next();
  } else {
    return res.status(401).json({ errors: [{ msg: "Authorization denied" }] });
  };
};

const authRoleProjMngr = (req, res, next) => {
  const { role } = req.user;
  if (req.user && (role === 'Project Manager' || role === 'Admin')) {
    next();
  } else {
    return res.status(401).json({ errors: [{ msg: "Authorization denied" }] });
  };
};

const authRoleSub = (req, res, next) => {
  const { role } = req.user;
  if (req.user && (role === 'Submitter' || role === 'Admin')) {
    next();
  } else {
    return res.status(401).json({ errors: [{ msg: "Authorization denied" }] });
  };
};

module.exports = {verifAuth, authRoleAdmin, authRoleDev, authRoleProjMngr, authRoleSub};