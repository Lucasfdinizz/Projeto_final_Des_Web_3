export default {
    props: {
        produtos: Array
    },
    setup(props, { emit }) {
        const route = VueRouter.useRoute();
        const id = route.params.id;
        const produto = props.produtos.find(p => p.id == id);

        if (!produto) {
            console.error('Produto não encontrado');
        }

        return {
            produto
        };
    },
    template: `
    <div v-if="produto">
        <h2>Detalhes do Produto</h2>
        <p>ID: {{ produto.id }}</p>
        <p>Nome: {{ produto.nome }}</p>
        <p>Preço: R$ {{ produto.preco.toFixed(2) }}</p>
        <p>Tamanho: {{ produto.tamanho }}</p>
    </div>
    <div v-else>
        <p>Produto não encontrado.</p>
    </div>
    `
};
