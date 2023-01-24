const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
    req.flash('error_msg', 'Usuario no autenticado');
    res.redirect('/users/signInForm');
  
};

helpers.isFuncionario = (req, res, next) => {
  if(req.user.role === 'Funcionario'){
    return next();
  }
  req.flash('error_msg', 'Usuario no Autorizado');
  res.redirect('/users/home');
};

helpers.isAdmin = (req, res, next) => {
  if(req.user.role === 'Admin'){
    return next();
  }
  req.flash('error_msg', 'Usuario no Autorizado');
  res.redirect('/users/home');
};

helpers.isDocente = (req, res, next) => {
  if(req.user.role === 'Docente'){
    return next();
  }
  req.flash('error_msg', 'Usuario no Autorizado');
  res.redirect('/users/home');
};

module.exports = helpers;