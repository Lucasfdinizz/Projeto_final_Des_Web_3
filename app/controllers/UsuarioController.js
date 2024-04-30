const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

class UsuarioController {
  async login(req, res) {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
      return res.status(400).json({ error: 'Nome de usuário e senha são necessários' });
    }

    try {
      console.log(`Tentando fazer login com nome: ${nome}`);
      const usuario = await Usuario.findOne({ nome });
      console.log(`Usuário encontrado: ${usuario}`);
      
      if (!usuario) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      const isPasswordMatch = await bcrypt.compare(senha, usuario.senha);
      console.log(`A senha corresponde: ${isPasswordMatch}`);
      
      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      const token = generateToken({ id: usuario.id, nome: usuario.nome });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/usuario');
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
    const usuario = new Usuario({ nome, senha });
    await usuario.save();
    res.redirect('/usuarios');
  }

  async list(req, res) {
    const usuarios = await Usuario.find();
    res.render('usuarios', { usuarios, messages: req.flash() });
  }

  async update(req, res) {
    const { id, nome, senha } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 10);
    await Usuario.findByIdAndUpdate(id, { nome, senha: hashedPassword });
    res.redirect('/usuario');
  }

  async delete(req, res) {
    const { id } = req.params;
    await Usuario.findByIdAndRemove(id);
    res.redirect('/usuario');
  }

  async getById(req, res) {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    res.render('usuario', { usuario });
  }
}

module.exports = UsuarioController;