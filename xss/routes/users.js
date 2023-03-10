var express = require('express');
var router = express.Router();
const controller = require('../controllers/com')

router.post('/login', controller.login)

module.exports = router;
