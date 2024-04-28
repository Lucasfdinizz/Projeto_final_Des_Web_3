let db;
const request = indexedDB.open("Produtos", 1);
request.onerror = (event) => {
    console.error("Erro ao abrir o banco de dados:", event.target.error);
};
request.onsuccess = (event) => {
    db = event.target.result;
    console.log('Banco de dados aberto com sucesso');
};

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    console.log('Atualizando o banco de dados');

    const objectStore = db.createObjectStore("produtos", { keyPath: "id", autoIncrement: true });
};

function adicionar(produto) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["produtos"], "readwrite");
        const objectStore = transaction.objectStore("produtos");
        const request = objectStore.add(produto);
        request.onsuccess = (event) => {
            const id = event.target.result;
            resolve(id);
        };
        request.onerror = (event) => {
            reject(new Error(event.target.error));
        };
    });
}

function listar() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["produtos"], "readonly");
        const objectStore = transaction.objectStore("produtos");
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(new Error(event.target.error));
        };
    });
}

function deletar(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["produtos"], "readwrite");
        const objectStore = transaction.objectStore("produtos");
        const request = objectStore.delete(id);
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(new Error(event.target.error));
        };
    });
}