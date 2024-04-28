export default {
    props: {
        produtos: Array
    },
    setup(props, { emit }) {
        const router = VueRouter.useRouter();

        function selecionar(produto) {
            router.push(`/detalhes/${produto.id}`);
        }

        function excluir(produto) {
            const confirmacao = confirm(`Tem certeza que deseja excluir o produto ${produto.nome}?`);
            if (confirmacao) {
                props.produtos = props.produtos.filter(p => p.id !== produto.id);
            }
        }

        return {
            selecionar,
            excluir
        };
    },
    template: `
    <div>
        <h1>Lista de Produtos</h1>
        <div v-for="produto of produtos" :key="produto.id" class="linha">
            {{produto.nome}} - Preço: R$ {{produto.preco.toFixed(2)}}
            - Tamanho: {{produto.tamanho}}
            <button @click="selecionar(produto);">Selecionar</button>
            <button @click="excluir(produto);">Excluir</button>
        </div>
    </div>
    `
};