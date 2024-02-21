// Middleware for handling auth
const jwt=require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const words=(req.headers.authorization).split(" ");
    const jwtToken=words[1];
    const decoded=jwt.verify(jwtToken,JWT_SECRET);
    if(decoded.username){
        next();
    }else{
        res.status(403).json({
            msg:"Admin is not authenticated"
        })
    }
}

module.exports = adminMiddleware;