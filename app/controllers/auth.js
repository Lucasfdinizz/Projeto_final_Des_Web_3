const { verifyToken } = require('../utils/jwt');

function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    const payload = verifyToken(token);

    if (!payload) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    req.user = payload;
    next();
}

module.exports = auth;