// Authorize.js

function Authorize(roleAccess) {
  return (req, res, next) => {
    // req.user precisa existir (provido pelo Authenticate)
    if (!req.user || req.user.role !== roleAccess) {
      return res.status(403).json({ error: "Access Denied" });
    }
    next();
  };
}

module.exports = Authorize;
