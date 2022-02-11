//import jsonwebtoken for verfication
const jwt = require("jsonwebtoken");
//import dotenv
require("dotenv").config();

const validateToken = (req, res, next) => {
  //extract token from headers of req.object
  tokenWithBearer = req.headers["authorisation"];
  //console.log(tokenWithBearer);
  //if token doesn't exists
  if (tokenWithBearer == undefined) {
    res.send({ message: "Unauthorised access" });
  }
  //if token exits
  else {
    //sepeate token from bearer
    let token = tokenWithBearer.slice(7, tokenWithBearer.length);
    //verify token
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        res.send({ message: "Session Expired" });
      } else {
        next();
      }
    });
  }
};

module.exports = validateToken;
