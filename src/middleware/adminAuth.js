const jwt = require("jsonwebtoken");

function adminAuth(req, res, next) {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).send("Access denied. Admins only.");
        }
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send("Invalid token.");
    }
}

module.exports = adminAuth;