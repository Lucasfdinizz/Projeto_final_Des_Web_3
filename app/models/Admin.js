const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  }
});

AdminSchema.pre('save', async function(next) {
  if (this.isModified('senha')) {
    this.senha = await bcrypt.hash(this.senha, 10);
  }
  next();
});

module.exports = mongoose.model('Admin', AdminSchema);