const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan payload token
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }
};


// module.exports = (req, res, next) => {   
//     const token = req.headers['authorization'];
//     if (!token) {
//         return res.status(403).send('Forbidden');
//     }
//     // Lakukan validasi token di sini (misalnya, dengan JWT)
//     next();
// };