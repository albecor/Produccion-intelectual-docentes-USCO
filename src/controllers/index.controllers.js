const indexCtrl = {};

indexCtrl.renderIndex = (req, res) => {
    if(req.user == undefined){
        res.render('index')
    }else{
        res.redirect('users/home')
    }       
}; 


module.exports = indexCtrl; 