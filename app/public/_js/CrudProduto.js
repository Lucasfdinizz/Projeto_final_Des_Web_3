export default {
    props: {
        produtos: Array
    },
    setup(props, { emit }) {
        const nome = Vue.ref('');
        const preco = Vue.ref(0);
        const tamanho = Vue.ref('');

        function inserir() {
            if (!nome.value || preco.value <= 0 || !tamanho.value) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const novoProduto = { nome: nome.value, preco: preco.value, tamanho: tamanho.value };
            props.produtos.push(novoProduto);
            nome.value = '';
            preco.value = 0;
            tamanho.value = '';

            alert('Produto adicionado com sucesso!');
        }

        return {
            nome,
            preco,
            tamanho,
            inserir
        };
    },
    template: `
    <div>
        <h2>Digite abaixo os dados:</h2>
        <form @submit.prevent="inserir">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" v-model="nome">
            <label for="preco">Preço:</label>
            <input type="number" id="preco" v-model="preco">
            <label for="tamanho">Tamanho:</label>
            <input type="text" id="tamanho" v-model="tamanho">
            <button type="submit">Adicionar Produto</button>
        </form>
    </div>
    `
};