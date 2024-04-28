const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  categoria: {
    type: String
  },
  preco: {
    type: Number,
    required: true
  },
  tamanho: {
    type: String,
   },
  descricao: {
    type: String,
    required: true
  },
  imagem: {
    type: String
  },
});

module.exports = mongoose.model('Produto', ProdutoSchema);
