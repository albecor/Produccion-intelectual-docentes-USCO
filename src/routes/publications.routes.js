const {Router} = require('express')
const router =Router();
const multer = require('multer')
const Upload = multer()
const {isAuthenticated, 
    isAdmin, 
    isDocente, 
    isFuncionario} = require('../helpers/auth');
const {
    //Docente
    renderAddPublication,
    AddPublication,
    fileVerification,
    renderMyPublications,
    deleteMyPublication,
    timeVerification,
    renderEditarPublicacion,
    editarPublicacion,

    //Funcionario
    renderAuditFn,
    renderAuditFnId,
    renderAuditCAP,
    renderAuditCAPId,
    revisionCAP,
    checkISSN,
    checkISBN,
    primeraRevision,
    renderSearchPublication,
    SearchPublication,
    renderRequest,
    dowloadFile,
    //Admin
    renderLoadISSN,
    loadISSN,
    renderISSN,
    renderLoadISBN,
    loadISBN,
    renderISBN
} = require('../controllers/publications.controllers');

//Docente

router.get('/publications/add',isAuthenticated, isDocente, renderAddPublication);

router.post('/publications/add',isAuthenticated, isDocente, AddPublication);

router.post('/publications/verification',isAuthenticated, isDocente, fileVerification);

router.get('/publications/myPublications',isAuthenticated, isDocente, renderMyPublications);

router.delete('/publications/delete/:id',isAuthenticated, isDocente, deleteMyPublication);

router.get('/publications/time',isAuthenticated, isDocente, timeVerification);

router.get('/publications/edit/:id', isAuthenticated, isDocente, renderEditarPublicacion);

router.post('/publications/edit', isAuthenticated, isDocente, editarPublicacion);


//Funcionario

router.get('/publications/audit/fn',isAuthenticated, isFuncionario, renderAuditFn);

router.get('/publications/audit/fn/:id', isAuthenticated, isFuncionario, renderAuditFnId);

router.get('/publications/audit/cap',isAuthenticated, isFuncionario, renderAuditCAP);

router.get('/publications/audit/cap/:id',isAuthenticated, isFuncionario, renderAuditCAPId);

router.post('/publications/reviewed/cap',isAuthenticated, isFuncionario, revisionCAP);

router.get('/publications/search',isAuthenticated, isFuncionario, renderSearchPublication);

router.post('/publications/search',isAuthenticated, isFuncionario, SearchPublication);

router.get('/publications/request/:id', isAuthenticated, isFuncionario, renderRequest);

router.get('/issn/check', isAuthenticated, isFuncionario, checkISSN)

router.get('/isbn/check', isAuthenticated, isFuncionario, checkISBN)

router.post('/publications/reviewed',isAuthenticated, isFuncionario, primeraRevision);


router.get('/file/download/:id', isAuthenticated, dowloadFile);

//ISSN ISBN

router.get('/load/issn', isAuthenticated, isAdmin, renderLoadISSN)

router.post('/load/issn', isAuthenticated, isAdmin, loadISSN)

router.get('/view/issn', isAuthenticated, isAdmin, renderISSN)

router.get('/load/isbn', isAuthenticated, isAdmin, renderLoadISBN)

router.post('/load/isbn', isAuthenticated, isAdmin, loadISBN)

router.get('/view/isbn', isAuthenticated, isAdmin, renderISBN)

module.exports = router;