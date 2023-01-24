const {Router} = require('express')
const router =Router();

const {isAuthenticated, isAdmin} = require('../helpers/auth');

const {
        createAdminForm, 
        createAdmin, 
        createUserForm, 
        createUser, 
        signInForm, 
        signIn,
        uptadeLogin, 
        home, 
        logout, 
        changePasswdForm, 
        changePasswd, 
        signInError,
        seeAllUsersAdmin,
        editUserFormAdmin, 
        editUserAdmin, 
        seeUserAdminForm, 
        deletUserAdmin, 
        forgotPasswordForm, 
        forgotPassword, 
        myProfile} = require('../controllers/users.controllers')
//Ingreso a la plataforma
router.get('/users/signInForm', signInForm);
router.post('/users/signIn', signIn);
router.get('/users/signInError', signInError);
router.get('/users/updateLogin', isAuthenticated, uptadeLogin);
router.get('/users/home', isAuthenticated, home);
router.get('/users/logout', logout);


//Acciones del administrador
router.get('/users/createUserForm',  isAuthenticated, isAdmin, createUserForm);
router.post('/users/createUser', isAuthenticated, isAdmin, createUser);
router.get('/users/createAdminForm', createAdminForm);//Primer administrador
router.post('/users/createAdmin', createAdmin);
router.get('/users/seeAllUsersAdmin', isAuthenticated, isAdmin, seeAllUsersAdmin);
router.get('/users/seeUserAdminForm/:id', isAuthenticated, isAdmin, seeUserAdminForm)
router.get('/users/editUserFormAdmin/:id', isAuthenticated, isAdmin, editUserFormAdmin);
router.put('/users/editUserAdmin/:id', isAuthenticated, isAdmin, editUserAdmin);
router.delete('/users/deleteUserAdmin/:id', isAuthenticated, isAdmin, deletUserAdmin);
//Acciones por todos los usuarios
router.get('/users/myProfile', isAuthenticated, myProfile);
router.get('/users/changePasswd', isAuthenticated, changePasswdForm);
router.post('/users/changePasswd', isAuthenticated, changePasswd);
router.get('/users/forgotPasswdForm', forgotPasswordForm);
router.post('/users/forgotPassword', forgotPassword)

module.exports = router;