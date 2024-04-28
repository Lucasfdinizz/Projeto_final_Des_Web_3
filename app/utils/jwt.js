require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SEGREDO_JWT;

function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (e) {
        console.error('Erro ao verificar o token:', e);
        return null;
    }
}

module.exports = { generateToken, verifyToken };