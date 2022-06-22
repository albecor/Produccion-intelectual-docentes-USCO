const {Router} = require('express')
const router =Router();
const multer = require('multer')
const Upload = multer()

const {isAuthenticated, isAdmin, isDocente, isFuncionario} = require('../helpers/auth');
const {
    renderAddPublication,
    AddPublication,
    sizeVerification,
    renderMyPublications,
    deleteMyPublication,
    renderAudit,
    renderReviewed,
    renderSearchPublication,
    renderCreateReport,
    renderAplication,
    dowloadFile
} = require('../controllers/publications.controllers');

router.get('/publications/add',isAuthenticated, isDocente, renderAddPublication);

router.post('/publications/add',isAuthenticated, isDocente, AddPublication);

router.post('/publications/verification',isAuthenticated, isDocente, sizeVerification);

router.get('/publications/myPublications',isAuthenticated, isDocente, renderMyPublications);

router.delete('/publications/delete/:id',isAuthenticated, isDocente, deleteMyPublication);

router.get('/publications/audit',isAuthenticated, isFuncionario, renderAudit);

router.get('/publications/reviewed',isAuthenticated, isFuncionario, renderReviewed);

router.get('/publications/search',isAuthenticated, isFuncionario, renderSearchPublication);

router.get('/publications/application', renderAplication);

router.get('/file/download/:id', isAuthenticated, dowloadFile);

module.exports = router;