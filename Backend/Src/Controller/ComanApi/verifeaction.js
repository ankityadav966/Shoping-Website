const jwt = require('jsonwebtoken');

const verificationMiddleware = async (req, res, next) => {
    try {
        const datatoken = req.headers.authorization;

        const token = datatoken && datatoken.split(" ")[1];

        if (!token) {
            return res.status(401).json({ status: "false", msg: "Token is required" });
        }
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" });
            }
            console.log(decoded)
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error("Middleware error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = verificationMiddleware;
