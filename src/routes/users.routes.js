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

/////Tareas comunes para todos los usuarios///////////////////////////////////////

///Formulario para el ingreso a la plataforma
router.get('/users/signInForm', signInForm);
router.post('/users/signIn', signIn);
router.get('/users/signInError', signInError);
router.get('/users/updateLogin', isAuthenticated, uptadeLogin);
router.get('/users/home', isAuthenticated, home);  

/////////// Salida de la plataforma /////////////////////////
router.get('/users/logout', logout);


//Crear un usuario de cualquier tipo.
router.get('/users/createUserForm',  isAuthenticated, isAdmin, createUserForm);
router.post('/users/createUser', isAuthenticated, isAdmin, createUser);

//Crear el primer administrador de la plataforma cuando se instala inicialmente 
router.get('/users/createAdminForm', createAdminForm);
router.post('/users/createAdmin', createAdmin);

////////////////////////////////////////////////////////////////////////////
////Operaciones realizadas por los administradores
////////////////////////////////////////////////////////////////////////////
//////////////Consultas, borrado y edición de usuarios //////////////////////////////
//Permite al admin ver todos los usuarios
router.get('/users/seeAllUsersAdmin', isAuthenticated, isAdmin, seeAllUsersAdmin);

////Permite ver y editar los usuarios///////////////////////////////////////////////
router.get('/users/seeUserAdminForm/:id', isAuthenticated, isAdmin, seeUserAdminForm)

router.get('/users/editUserFormAdmin/:id', isAuthenticated, isAdmin, editUserFormAdmin);///Formulario para editar usuarios
router.put('/users/editUserAdmin/:id', isAuthenticated, isAdmin, editUserAdmin);/////actualiza usuario

//////////////Borrar usuarios //////////////////////////////
router.delete('/users/deleteUserAdmin/:id', isAuthenticated, isAdmin, deletUserAdmin);


//////////////////////////////////////////////////////////////////////////// 
////Operaciones comunes - realizadas por todos los usuarios/////////////////
///////////////////////////////////////////////////////////////////////////
router.get('/users/myProfile', isAuthenticated, myProfile);

router.get('/users/changePasswd', isAuthenticated, changePasswdForm);
router.post('/users/changePasswd', isAuthenticated, changePasswd);
///Cuando olvidamos la contraseña
router.get('/users/forgotPasswdForm', forgotPasswordForm);
router.post('/users/forgotPassword', forgotPassword)
////////////////////////////////////////////////////////////////////////////

module.exports = router;