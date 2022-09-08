const {Router} = require('express')
const router =Router();
const multer = require('multer')
const Upload = multer()

const {isAuthenticated, isAdmin, isDocente, isFuncionario} = require('../helpers/auth');
const {
    //Docente
    renderAddPublication,
    AddPublication,
    sizeVerification,
    renderMyPublications,
    deleteMyPublication,
    timeVerification,

    //Funcionario
    renderAudit,
    renderReviewed,
    renderSearchPublication,
    renderCreateReport,
    renderRequest,
    dowloadFile,
} = require('../controllers/publications.controllers');

router.get('/publications/add',isAuthenticated, isDocente, renderAddPublication);

router.post('/publications/add',isAuthenticated, isDocente, AddPublication);

router.post('/publications/verification',isAuthenticated, isDocente, sizeVerification);

router.get('/publications/myPublications',isAuthenticated, isDocente, renderMyPublications);

router.delete('/publications/delete/:id',isAuthenticated, isDocente, deleteMyPublication);

router.get('/publications/time',isAuthenticated, isDocente, timeVerification);


//Docente

router.get('/publications/audit',isAuthenticated, isFuncionario, renderAudit);

router.get('/publications/reviewed',isAuthenticated, isFuncionario, renderReviewed);

router.get('/publications/search',isAuthenticated, isFuncionario, renderSearchPublication);

router.get('/publications/request/:id', isAuthenticated, isFuncionario, renderRequest);

router.get('/file/download/:id', isAuthenticated, dowloadFile);

module.exports = router;