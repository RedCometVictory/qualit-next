import jwt from 'jsonwebtoken';
import { toast } from "react-toastify";

const JWT_SECRET = process.env.JWT_SECRET;
const authIsExpired = async () => {
  return toast.error("Session expired. Please Login.");
};

const verifAuth = async (req, res, next) => {
  const { qual__token } = req.cookies;
  if (!qual__token) {
    return res.status(401).send("No token or auth cookie. Authorization denied.");
  };

  try {
    jwt.verify(qual__token, JWT_SECRET, (err, decoded) => {
      if (err) {
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

module.exports = { authIsExpired, verifAuth, authRoleAdmin, authRoleDev, authRoleProjMngr, authRoleSub };