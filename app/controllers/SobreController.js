class SobreController {
    index(req, res) {
        const sobre = {
            nome: 'Autor: Lucas de França Diniz',
            formacoes: [
                'Análise e Desenvolvimento de Sistemas (Cursando)',
                'Universidade Estácio de Sá',
                'Ano: 2022',
                'Técnico em Informática para Internet (Cursando)',
                'Instituto Federal do Ceará',
                'Ano: 2023'
            ],
            experiencias: [
                '3º sgt do Exército Brasileiro',
                'Ano: Desde 2016'
            ]
        };

        res.render('sobre', sobre);
    }
}

module.exports = SobreController;