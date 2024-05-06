class SobreController {
    index(req, res) {
        const sobre = {
            nome: 'Autor: Lucas de França Diniz',
            formacoes: [
                {
                    curso: 'Análise e Desenvolvimento de Sistemas',
                    status: 'Cursando',
                    instituicao: 'Universidade Estácio de Sá',
                    anoInicio: 2022
                },
                {
                    curso: 'Técnico em Informática para Internet',
                    status: 'Cursando',
                    instituicao: 'Instituto Federal do Ceará',
                    anoInicio: 2023
                }
            ],
            experiencias: [
                {
                    nomeDeGuerra: 'Diniz',
                    postoGraducao: '3º Sgt',
                    instituicao: 'Exército Brasileiro',
                    status: 'Militar da Ativa',
                    anoInicio: 2016
                }
            ]
        };

        res.render('sobre', { sobre });
    }
}

module.exports = SobreController;
