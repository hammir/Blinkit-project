const jwt = require("jsonwebtoken");

async function authAdmin(req, res, next) {
    // use name of the cookie that stores the admin token
    // in this case, it is "Admin_Login_Token"
  let token = req.cookies.Admin_Login_Token;

  try {
    if (!token) {
      return res.send("Login First");
    }

    let data = jwt.verify(token, process.env.JWT_KEY);
    req.user = data;
    next();
  } catch (error) {
    return res.send(error.message); 
  }
}

module.exports = authAdmin;
