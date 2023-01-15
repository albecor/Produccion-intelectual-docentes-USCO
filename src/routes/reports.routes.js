const {Router} = require('express')
const router =Router();
const multer = require('multer')
const Upload = multer()

const {isAuthenticated, isAdmin, isDocente, isFuncionario} = require('../helpers/auth');
const {
    renderGenerarInforme,
    searchDocentes,
    searchDocenteCC,
    GenerarInforme,
} = require('../controllers/reports.controllers');

router.get('/generar/informe', isAuthenticated, isFuncionario, renderGenerarInforme);

router.get('/docentes/search',isAuthenticated, isFuncionario, searchDocentes);

router.get('/docentes/search/cc',isAuthenticated, isFuncionario, searchDocenteCC);

router.post('/generar/informe', isAuthenticated, isFuncionario, GenerarInforme);

module.exports = router;