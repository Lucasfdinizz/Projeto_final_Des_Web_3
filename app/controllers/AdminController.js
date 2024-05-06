const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

class AdminController {
  async login(req, res) {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
      return res.status(400).json({ error: 'Nome de usuário e senha são necessários' });
    }

    try {
      console.log(`Tentando fazer login com nome: ${nome}`);
      const admin = await Admin.findOne({ nome });
      console.log(`Administrador encontrado: ${admin}`);
      
      if (!admin) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      const isPasswordMatch = await bcrypt.compare(senha, admin.senha);
      console.log(`A senha corresponde: ${isPasswordMatch}`);
      
      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      const token = generateToken({ id: admin.id, nome: admin.nome });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/admin');
    } catch (error) {
      console.error('Erro durante o login:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
  showLoginForm(req, res) {
    res.render('login', { messages: req.flash() });
  }

  async create(req, res) {
    const { nome, senha } = req.body;
    const admin = new Admin({ nome, senha });
    try {
        await admin.save();
        console.log(`Admin criado com sucesso: ${admin}`);
    } catch (error) {
        console.error('Erro ao cadastrar admin:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    res.redirect('/admins');
  }


  async list(req, res) {
    const admins = await Admin.find();
    res.render('admins', { admins, messages: req.flash() });
  }

  async update(req, res) {
    const { id, nome, senha } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 10);
    await Admin.findByIdAndUpdate(id, { nome, senha: hashedPassword });
    res.redirect('/admin');
  }

  async delete(req, res) {
    const { id } = req.params;
    await Admin.findByIdAndRemove(id);
    res.redirect('/admin');
  }

  async getById(req, res) {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    res.render('admin', { admin });
  }
}

module.exports = AdminController;