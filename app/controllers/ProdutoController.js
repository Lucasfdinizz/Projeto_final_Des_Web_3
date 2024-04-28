const Produto = require('../models/Produto');

class ProdutoController {
    async create(req, res) {
        const { nome, descricao, preco } = req.body;
        const produto = await Produto.create({ nome, descricao, preco });
        res.redirect('/produtos');
    }

    async list(req, res) {
        const produtos = await Produto.find();
        res.render('produtos', { produtos });
    }

    async edit(req, res) {
        const { id } = req.params;
        try {
            const produto = await Produto.findById(id);
            if (!produto) {
                return res.redirect('/produtos');
            }
            res.render('editar_produto', { produto });
        } catch (error) {
            console.error('Erro ao editar produto:', error);
            res.status(500).send('Erro ao editar produto');
        }
    }
    

    async update(req, res) {
        const { id, nome, descricao, preco } = req.body;
        await Produto.findByIdAndUpdate(id, { nome, descricao, preco });
        res.redirect('/produtos');
    }

    async delete(req, res) {
        const { id } = req.params;
        await Produto.findByIdAndDelete(id);
        req.session.messages = { success: 'Produto excluído com sucesso.' };
        res.redirect('/produtos');
    }

    async getById(req, res) {
        const { id } = req.params;
        const produto = await Produto.findById(id);
        res.render('detalhes_produto', { produto });
    }
}

module.exports = ProdutoController;