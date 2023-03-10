const conn = require('../config/database')

const controller = {}

controller.create = async (req, res) => {
    try{
        // Salva o comentário no BD
        await conn.query(`
            insert into comments(comment)
            values ($1)
        `, [req.body.comment]) 
        // redireciona de volta para o formuário
        res.redirect('/')
    }
    catch(error){
        console.error(error)
    }
}

module.exports = controller 