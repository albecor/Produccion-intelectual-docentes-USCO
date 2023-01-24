const usersCtrl = {};

const User = require('../models/User')
const passport = require('passport');
const short = require('short-uuid');
const nodemailer = require("nodemailer");

//Ingreso a la plataforma
usersCtrl.signInForm = (req, res)=>{
    if(req.user==undefined){
        res.render('users/signInForm')
    }else{
        res.redirect('/users/home')
    }
};
usersCtrl.signIn = passport.authenticate('local', {
    successRedirect: "/users/updateLogin",
    failureRedirect: "/users/signInError",
    failureFlash: true
});
usersCtrl.signInError = (req, res)=>{
    req.flash('error_msg', 'Usuario o contraseña invalida');
    res.redirect('signInForm')
};
usersCtrl.uptadeLogin = async (req,res) => {
    await User.findByIdAndUpdate(req.user.id,{last_login_date:Date.now()});
    res.redirect('/users/home')
}
usersCtrl.home = (req, res)=>{
    let Admin = Funcionario =  Docente = null;
    switch (req.user.role) {
        case 'Admin':
            Admin = true;
            break;
        case 'Funcionario':
            Funcionario = true;
            break;
        case 'Docente':
            Docente = true;
            break;
    }
    const {name, lastname, sec_lastname } = req.user;
    res.render('users/home', {Admin, Funcionario, Docente, name, lastname, sec_lastname});
};
usersCtrl.logout = (req, res)=>{
    req.logout();
    req.flash("success_msg", "Has cerrado sesión");
    res.redirect("/");
};
//Acciones del Administrador
usersCtrl.createUserForm = (req, res)=>{
    let json = require('../public/json/colombia.json');
    let Admin = true;
    const {name, lastname, sec_lastname } = req.user;
    res.render('users/createUserForm', { Admin, json, name, lastname, sec_lastname })
};
usersCtrl.createUser = async (req, res)=>{
    var Admin = true;
    const errors = [];
    const { 
        identification_type,
        identification,
        name,
        lastname,
        sec_lastname,
        phone,
        address,
        city,
        department,
        role,
        email,
        password,
        confirm_password,
        facultad,
        programa,
        vinculacion,
        investigacion,
        nombreGrupo,
        lineaInvestigacion
    } = req.body;

    const userIdentification = await User.findOne({ identification }).lean();
    const userEmail = await User.findOne({ email }).lean();

    ////Información personal
    if (userIdentification) {
        errors.push({ text: 'La identificación del usuario ya existe en nuestra base de datos' });
    }

    ////Información de sesión
    if (userEmail) {
        errors.push({ text: 'El email ya está en uso' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.length < 5) {
        errors.push({ text: 'Las contraseñas deben tener almenos 5 caracteres' });
    }

    // Errores

    if (errors.length > 0) {
        req.flash("errors", errors);
        res.redirect("/users/createUserForm");
    }else {
        const newUser = new User({
            identification_type,
            identification,
            name,
            lastname,
            sec_lastname,
            phone,
            address,
            city,
            department,
            role,
            email,
            password,
            confirm_password,
            facultad,
            programa,
            vinculacion,
            investigacion,
            nombreGrupo,
            lineaInvestigacion
        });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Usuario agregado');
        res.redirect('home');
    }
};
usersCtrl.createAdminForm = async (req, res)=>{
    let json = require('../public/json/colombia.json');
    const user = await User.findOne({role: "Admin"}).lean();
    if(!user){
        res.render('users/createAdminForm',{json})
    }else{
        req.flash('error_msg', 'Ya existe un administrador');
        res.redirect('/')
    }
};
usersCtrl.createAdmin = async (req, res)=>{
    const errors = [];
    const { identification_type, identification, name, lastname, sec_lastname, phone, address, city, department, role, email, password, confirm_password} = req.body;
    const userIdentification = await User.findOne({ identification }).lean();
    const userEmail = await User.findOne({ email }).lean();
    if(identification_type === '--- Elija un tipo de identificación ---') {
        errors.push({ text: 'Debe ingresar un tipo de identificación valido' });
    }
    if (userIdentification) {
        errors.push({ text: 'La identificación del usuario ya existe en nuestra base de datos' });
    }

    if (userEmail) {
        errors.push({ text: 'El email del usuario ya existe en nuestra base de datos' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.length < 5) {
        errors.push({ text: 'Las contraseñas deben tener almenos 5 caracteres!!!' });
    }

    if (errors.length > 0) {
        req.flash('errors',errors)
        res.redirect('/users/createAdminForm')
    }else {
        const data = { identification_type, identification, name, lastname, sec_lastname, phone, address, city, department, role, email, password,};
        const newUser = new User(data);
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Usuario administrador creado');
        res.redirect('/');
    }
};
usersCtrl.seeAllUsersAdmin = async (req, res)=>{
    const Admin = true;
    const pList = await User.find().lean();
    pList.map((obj,i)=>{
        obj['index'] = i+1;
    })
    res.render('users/seeAllUserAdmin', {pList, Admin})
};
usersCtrl.seeUserAdminForm = async (req, res) => {
    const user1 = await User.findById(req.params.id).lean();
    const Admin = true;
    res.render('users/seeUserAdminForm', {user1, Admin})
}
usersCtrl.editUserFormAdmin = async (req, res) => {
    const user1 = await User.findById(req.params.id).lean();
    const Admin = true;
    let json = require('../public/json/colombia.json');
    res.render('users/editUserAdminForm', {user1, Admin, json})
};
usersCtrl.editUserAdmin = async (req, res) => {
    const {name, lastname, sec_lastname, identification, email, role} = req.body
    await User.findByIdAndUpdate(req.params.id, {name, lastname, sec_lastname, identification, email, role})
    const admin = true
    res.redirect('/users/seeAllUsersAdmin')
};
usersCtrl.deletUserAdmin = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users/seeAllUsersAdmin')
};
//Acciones por todos los usuarios
usersCtrl.myProfile = async (req, res)=>{
    const {_id,role} = req.user;
    let user = await User.findById(_id).lean()
    let Admin = false,Funcionario = false, Docente = false;
    switch (role) {
        case 'Admin':
            Admin = true;
            break;
        case 'Funcionario':
            Funcionario = true;
            break;
        case 'Docente':
            Docente = true;
            break;
    }
    res.render('users/myProfile', {Admin,Funcionario,Docente, user});
}
usersCtrl.changePasswdForm = (req, res)=>{
    const user = req.user;
    switch (req.user.role) {
        case 'Admin':
            let Admin = true;
            res.render('users/users/changePasswd', {Admin, user});
            break;
        case 'Funcionario':
            let Funcionario = true;
            res.render('users/users/changePasswd', {Funcionario, user});
            break;
        case 'Docente':
            let Docente = true;
            res.render('users/users/changePasswd', {Docente, user});
            break;
    }

}
usersCtrl.changePasswd = async (req, res)=>{
    const errors = [];
    const { actual_password, new_password, confirm_new_password } = req.body

    const match = await req.user.matchPassword(actual_password);
    if(!match){
        //console.log('No digitaste bien tu contraseña actual!!!')
        errors.push({ text: 'No digitaste bien tu contraseña actual'});
    }
    if ( new_password != confirm_new_password) {
        errors.push({ text: 'La neva contraseña y la confirmación no coinciden' });
    }
    if (new_password.length < 5) {
        errors.push({ text: 'La nueva contraseña debe tener almenos 5 caracteres'});
    }

    if (errors.length > 0) {
        switch (req.user.role) {
            case 'Admin':
                let Admin = true;
                res.render('users/users/changePasswd', {Admin, user});
                break;
            case 'Funcionario':
                let Funcionario = true;
                res.render('users/users/changePasswd', {Funcionario, user});
                break;
            case 'Docente':
                let Docente = true;
                res.render('users/users/changePasswd', {Docente, user});
                break;
    }
    } else {
        password = await req.user.encryptPassword(new_password);
        const id = req.user._id;
        await User.findByIdAndUpdate(id, { password });
        req.flash('success_msg', 'Contraseña actualizada');
        res.redirect('/users/home')
    }
};
usersCtrl.forgotPasswordForm = (req, res)=>{
    if(req.user == undefined){
        res.render('users/forgotPasswordForm')
    }else{
        res.redirect('/users/home')
    }
}
usersCtrl.forgotPassword = async (req, res)=>{
    const { email } = req.body;
    const user = await User.findOne({email}).lean();
    if(user != null){
        const {name, lastname, sec_lastname} = user;
        var passwd = short.generate();
        let password = await user.encryptPassword(passwd);
        const id = user._id;
        await User.findByIdAndUpdate(id, { password });
        const message = "Su contraseña ha sido cambiada."
        contentHTML = `
        <h1>Módulo CAP</h1>
        <h4>Producción intelectual de docentes</h4>
        <ul>
            <li>Usuario: ${name } ${lastname } ${sec_lastname }</li>
            <li>Email: ${email}</li>
            <li>Nueva contraseña: ${passwd}</li>
        </ul>
        <p>${message}</p> `;
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 485,
            secure: false,
            auth: {
                user: 'u2010295844@usco.edu.co',
                pass: 'qjnkezubxrlvmqmv'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let info = await transporter.sendMail({
            from: '"Plataforma PSA - GTST-Usco" <gtst@usco.edu.co>',
            to: email,
            subject: 'Recuperación de contraseña',
            html: contentHTML
        })


    }
    req.flash('success_msg', 'Por favor revisa tu correo electrónico!!!');
    res.redirect('/users/signInForm')
}

module.exports = usersCtrl;