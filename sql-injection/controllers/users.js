const conn = require('../config/database')

const controller = {}

controller.login = async (req, res) => {
    try {
        const sql = `select * from users where username = '${req.body.username}' and password = '${req.body.password}'`
        console.log('SQL', sql)
        
        const result = await conn.query(sql)
        console.log(result)

        if(result.rows.length > 0){
            res.render('loggedin',{
                title: 'Seja bem vindo',
                message: 'Autenticacao concluida com sucesso'
            })
        }
        else{
            res.render('loggedin',{
                title: 'Acesso Negado',
                message: 'Usuário ou senha incorretos.'
            })
        }

    }
catch(error)
{
    res.render('error', {title: 'Erro', error})
}
}
module.exports = controller