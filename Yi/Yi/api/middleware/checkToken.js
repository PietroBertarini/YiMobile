const jwt = require('jsonwebtoken');
const checkToken = require("../middleware/checkToken");

module.exports = (req, res,next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, 'senha');
        req.userData = jwt.decode(token);
        
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Problem at login token,please login again e try again with a new token'
        });
    };

};