const { verifyToken } = require('../utils/jwt');

function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        req.flash('error', 'Por favor, faça o login para acessar esta página.');
        return res.redirect('/admin'); // Redireciona para a página de login se não houver token
    }

    const payload = verifyToken(token);

    if (!payload) {
        req.flash('error', 'Sessão expirada. Faça o login novamente.');
        return res.redirect('/admin'); // Redireciona para a página de login se o token não for válido
    }

    req.user = payload; // Adiciona o usuário autenticado ao objeto de solicitação para uso posterior
    next(); // Continua com a próxima função de middleware
}

module.exports = auth;