const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

class AdminController {
  async login(req, res) {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
      req.flash('error', 'Nome de usuário e senha são necessários');
      return res.redirect('/admin/login');
    }

    try {
      const admin = await Admin.findOne({ nome });

      if (!admin) {
        req.flash('error', 'Usuário ou senha inválidos');
        return res.redirect('/admin/login');
      }

      const isPasswordMatch = await bcrypt.compare(senha, admin.senha);

      if (!isPasswordMatch) {
        req.flash('error', 'Usuário ou senha inválidos');
        return res.redirect('/admin/login');
      }

      const token = generateToken({ id: admin.id, nome: admin.nome });
      res.cookie('token', token, { httpOnly: true });
      req.flash('success', 'Login realizado com sucesso');
      res.redirect('/admin');
    } catch (error) {
      console.error('Erro durante o login:', error);
      req.flash('error', 'Erro interno do servidor');
      res.redirect('/admin/login');
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
      req.flash('success', 'Administrador cadastrado com sucesso');
      res.redirect('/admin/login');
    } catch (error) {
      console.error('Erro ao cadastrar administrador:', error);
      req.flash('error', 'Erro ao cadastrar administrador');
      res.redirect('/admin/login');
    }
  }

  async list(req, res) {
    const admins = await Admin.find();
    res.render('admins', { admins, messages: req.flash() });
  }

  async update(req, res) {
    const { id, nome, senha } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 10);
    try {
      await Admin.findByIdAndUpdate(id, { nome, senha: hashedPassword });
      req.flash('success', 'Administrador atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar administrador:', error);
      req.flash('error', 'Erro ao atualizar administrador');
    }
    res.redirect('/admin');
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      await Admin.findByIdAndRemove(id);
      req.flash('success', 'Administrador removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover administrador:', error);
      req.flash('error', 'Erro ao remover administrador');
    }
    res.redirect('/admin');
  }

  async getById(req, res) {
    const { id } = req.params;
    try {
      const admin = await Admin.findById(id);
      res.render('admin', { admin });
    } catch (error) {
      console.error('Erro ao buscar administrador:', error);
      req.flash('error', 'Erro ao buscar administrador');
      res.redirect('/admin');
    }
  }
}

module.exports = AdminController;