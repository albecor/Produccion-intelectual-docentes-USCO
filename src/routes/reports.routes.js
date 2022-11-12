const {Router} = require('express')
const router =Router();
const multer = require('multer')
const Upload = multer()

const {isAuthenticated, isAdmin, isDocente, isFuncionario} = require('../helpers/auth');
//const {} = require('../controllers/reports.controllers');


module.exports = router;