class Produto {
    constructor(nome, categoria, preco, tamanho, descricao, imagem) {
        this.nome = nome;
        this.categoria = categoria;
        this.preco = parseFloat(preco).toFixed(2); // Converte para número e formata para duas casas decimais
        this.tamanho = tamanho;
        this.descricao = descricao;
        this.imagem = imagem;
    }
}

module.exports = Produto;
