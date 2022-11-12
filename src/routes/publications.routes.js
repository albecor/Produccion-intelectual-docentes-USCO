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
    renderAuditFn,
    renderAuditFnId,
    renderAuditCAP,
    checkISSN,
    renderReviewed,
    renderSearchPublication,
    renderCreateReport,
    renderRequest,
    dowloadFile,

    renderLoadISSN,
    renderISSN,
    loadISSN
} = require('../controllers/publications.controllers');

//Docente

router.get('/publications/add',isAuthenticated, isDocente, renderAddPublication);

router.post('/publications/add',isAuthenticated, isDocente, AddPublication);

router.post('/publications/verification',isAuthenticated, isDocente, sizeVerification);

router.get('/publications/myPublications',isAuthenticated, isDocente, renderMyPublications);

router.delete('/publications/delete/:id',isAuthenticated, isDocente, deleteMyPublication);

router.get('/publications/time',isAuthenticated, isDocente, timeVerification);


//Funcionario

router.get('/publications/audit/fn',isAuthenticated, isFuncionario, renderAuditFn);

router.get('/publications/audit/fn/:id', isAuthenticated, isFuncionario, renderAuditFnId);

router.get('/publications/audit/cap',isAuthenticated, isFuncionario, renderAuditCAP);

router.get('/publications/reviewed',isAuthenticated, isFuncionario, renderReviewed);

router.get('/publications/search',isAuthenticated, isFuncionario, renderSearchPublication);

router.get('/publications/request/:id', isAuthenticated, isFuncionario, renderRequest);

router.get('/issn/check', isAuthenticated, isFuncionario, checkISSN)


router.get('/file/download/:id', isAuthenticated, dowloadFile);

router.get('/load/issn', isAuthenticated, isAdmin, renderLoadISSN)

router.post('/load/issn', isAuthenticated, isAdmin, loadISSN)

router.get('/view/issn', isAuthenticated, isAdmin, renderISSN)

module.exports = router;