const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const webpush = require('web-push');
const multer = require('multer');
const Produto = require('./models/Produto');
const router = require('./routes/index');

require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Defina as chaves VAPID - você pode gerar essas chaves usando o web-push
webpush.setVapidDetails(
    'mailto:seuemail@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conexão com o MongoDB estabelecida com sucesso');
    })
    .catch((error) => {
        console.error('Erro ao estabelecer conexão com o MongoDB:', error);
    });

app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SEGREDO_JWT,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.session.messages;
    delete req.session.messages;
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}] ${req.method} to ${req.url}`);
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let subscriptions = [];

// Rota para salvar as subscrições
app.post('/subscribe', (req, res) => {
    subscription = req.body;
    subscriptions.push(subscription);
    console.log({ subscriptions });
    res.status(201).json({});
});

app.get('/push', (req, res) => {
    res.render('push');
});

// Rota para enviar notificações
app.get('/notificar', (req, res) => {
    const payload = JSON.stringify({ title: req.query.msg });
    console.log('notificando', subscriptions);
    for (let subscription of subscriptions) {
        webpush.sendNotification(subscription, payload)
            .catch(error => console.error('Erro ao notificar:', error));
        console.log('notificando', subscription);
    }
    res.send('ok');
});

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/_img'); // Salva as imagens na pasta 'public/_img'
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Registrar o service worker
app.get('/worker.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'worker.js'));
});

app.get('/', async (req, res) => {
    try {
        const produtos = await Produto.find(); // Consulta todos os produtos no banco de dados
        res.render('index', { produtos, carrinho: req.session.carrinho || [] }); // Passa a lista de produtos e o carrinho para o template
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        res.status(500).send('Erro ao carregar produtos');
    }
});

const carrinho = [];

// Rota para adicionar produtos ao carrinho
app.post('/adicionar-ao-carrinho/:id', async (req, res) => {
    const produtoId = req.params.id;
    const produto = await Produto.findById(produtoId);
    if (produto) {
        carrinho.push(produto);
        res.redirect('/'); // Redireciona para a página inicial após adicionar ao carrinho
    } else {
        res.status(404).send('Produto não encontrado');
    }
});

// Middleware para inicializar o carrinho na sessão
app.use((req, res, next) => {
    if (!req.session.carrinho) {
        req.session.carrinho = [];
    }
    next();
});

// Rota para exibir o formulário de criação de produtos
app.get('/produtos/criar', (req, res) => {
    res.render('criar_produto', { 
        success: req.flash('success'),
        error: req.flash('error') 
    });
});

// Rota para processar o formulário de criação de produtos
app.post('/produtos', upload.single('imagem'), async (req, res) => {
    try {
        let imagem = req.file ? req.file.filename : null; // Salva o nome do arquivo no campo imagem
        const novoProduto = await Produto.create({...req.body, imagem: imagem});
        console.log('Novo produto criado:', novoProduto);
        req.flash('success', 'Produto cadastrado com sucesso');
        res.redirect('/produtos/criar');
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        req.flash('error', 'Erro ao cadastrar produto');
        res.redirect('/produtos/criar');
    }
});

// Rota para exibir o formulário de edição de produtos
app.get('/produtos/editar/:id', async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id);
        if (!produto) {
            req.flash('error', 'Produto não encontrado');
            return res.redirect('/produtos');
        }
        res.render('editar_produto', { produto, success: req.flash('success'), error: req.flash('error') }); // Passando a variável error
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        req.flash('error', 'Erro ao buscar produto');
        res.redirect('/produtos');
    }
});

app.put('/produtos/:id', async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id);
        if (!produto) {
            req.flash('error', 'Produto não encontrado');
            return res.redirect('/produtos');
        }

        // Atualize os campos do produto com os valores do corpo da requisição
        produto.nome = req.body.nome;
        produto.categoria = req.body.categoria;
        produto.preco = req.body.preco;
        produto.tamanho = req.body.tamanho;
        produto.descricao = req.body.descricao;

        // Salve as alterações no banco de dados
        await produto.save();
        
        console.log('Produto atualizado:', produto);

        req.flash('success', 'Produto atualizado com sucesso');
        res.redirect('/produtos');
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        req.flash('error', 'Erro ao atualizar produto');
        res.redirect('/produtos');
    }
});

app.use('/', router);

app.use((req, res, next) => {
    res.status(404).send('Página não encontrada');
});

mongoose.connection.on('connected', () => {
    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
});