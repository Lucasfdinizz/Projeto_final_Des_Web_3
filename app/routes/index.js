const express = require('express');
const router = express.Router();
const Produto = require('../lib/Produto');
const ProdutoController = require('../controllers/ProdutoController');
const AdminController = require('../controllers/AdminController');
const UsuarioController = require('../controllers/UsuarioController');
const SobreController = require('../controllers/SobreController');
const auth = require('../controllers/auth'); // Importação do middleware auth
const flash = require('connect-flash'); // Importação do connect-flash para exibir mensagens

const adminController = new AdminController();
const usuarioController = new UsuarioController();
const sobreController = new SobreController();
const produtoController = new ProdutoController();

router.use(flash()); // Middleware para utilizar o connect-flash

router.get('/produtos/editar/:id', auth, (req, res) => {
    const { id } = req.params;
    ProdutoController.editar(req, res);
});

router.get('/admin', (req, res) => adminController.list(req, res));

router.get('/usuario', auth, (req, res) => usuarioController.list(req, res));

router.post('/produtos', auth, (req, res) => produtoController.create(req, res));
router.get('/produtos', auth, (req, res) => produtoController.list(req, res));

router.get('/admin/create', (req, res) => res.render('criar_admin'));
router.post('/admin/create', (req, res) => adminController.create(req, res));

router.get('/admin/login', (req, res) => adminController.showLoginForm(req, res));
router.post('/admin/login', (req, res) => adminController.login(req, res));

router.get('/admins', (req, res) => adminController.list(req, res));

router.put('/produtos/:id', auth, (req, res) => produtoController.update(req, res));
router.delete('/produtos/:id', auth, (req, res) => produtoController.delete(req, res));
router.get('/produtos/:id', auth, (req, res) => produtoController.getById(req, res));

router.get('/', (req, res) => res.render('index'));

router.get('/sobre', (req, res) => sobreController.index(req, res));

module.exports = router;