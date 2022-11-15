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
    renderAuditCAPId,
    revisionCAP,
    renderReviewedCAP,
    checkISSN,
    renderReviewed,
    primeraRevision,
    renderSearchPublication,
    SearchPublication,
    renderCreateReport,
    renderRequest,
    dowloadFile,
    renderRechazadas,

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

router.get('/publications/audit/cap/:id',isAuthenticated, isFuncionario, renderAuditCAPId);

router.post('/publications/reviewed/cap',isAuthenticated, isFuncionario, revisionCAP);

router.get('/publications/reviewed/cap',isAuthenticated, isFuncionario, renderReviewedCAP);

router.get('/publications/reviewed/fn',isAuthenticated, isFuncionario, renderReviewed);

router.get('/publications/search',isAuthenticated, isFuncionario, renderSearchPublication);

router.post('/publications/search',isAuthenticated, isFuncionario, SearchPublication);

router.get('/publications/request/:id', isAuthenticated, isFuncionario, renderRequest);

router.get('/issn/check', isAuthenticated, isFuncionario, checkISSN)

router.post('/publications/reviewed',isAuthenticated, isFuncionario, primeraRevision);



router.get('/publications/rechazadas',isAuthenticated, isFuncionario, renderRechazadas);


router.get('/file/download/:id', isAuthenticated, dowloadFile);

router.get('/load/issn', isAuthenticated, isAdmin, renderLoadISSN)

router.post('/load/issn', isAuthenticated, isAdmin, loadISSN)

router.get('/view/issn', isAuthenticated, isAdmin, renderISSN)

module.exports = router;