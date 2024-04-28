class Produto {
    constructor(nome, categoria, preco, tamanho, descricao, imagem) {
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco.toFixed(2); // Formata o preço para duas casas decimais
        this.tamanho = tamanho;
        this.descricao = descricao;
        this.imagem = imagem;
    }
}

module.exports = Produto;