const publicationsCtrl = {};

const Publication = require('../models/publications')
const User = require('../models/User')
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');
const fs = require('fs');
const moment = require('moment');


publicationsCtrl.renderAddPublication = (req, res) => {
    let Docente = true;
    let json = require('../public/json/types_publications.json');
    res.render('publications/addPublication',{json,Docente})
};

const storage = multer.diskStorage({
    destination: (req,file, cb)=>{
        filePath = path.join(__dirname , '../public/img/uploads')
        cb(null,filePath)
    },
    filename: (req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
})

const uploadFile = multer({
    storage,
    limits: {fileSize: 1000000 * 5}
}).single('upFile');

publicationsCtrl.sizeVerification = async (req,res,next) => {
    uploadFile(req, res, async (err) => {
        if (err) {
            return res.send(false)
        }else{
            return await res.send(req.file)
        }
    })
}

publicationsCtrl.AddPublication = async (req, res, next) => {
    let {
        originalname,
        mimetype,
        filename,
        path,
        size,
        name,
        URL,
        datePublication,
        clase,
        subclase,
        caracter,
        description
    } = req.body;
    let id_Docente = req.user.id;
    caracter = caracterToView(caracter);
    const newPublication = new Publication({
        id_Docente,
        name,
        datePublication,
        description,
        URL,
        clase,
        subclase,
        caracter,
        filename,
        path,
        originalname,
        mimetype,
        size,
    });
    await newPublication.save();
    res.send(true)
};

publicationsCtrl.renderMyPublications = async (req, res) => {
    let {id} = req.user;
    let publications = await Publication.find({id_Docente:id}).sort({createdAt:-1}).lean();
    for (let i in publications) {
        let fecha_i = new Date(publications[i].datePublication);
        let yy = fecha_i.getFullYear();
        yy = yy.toString();
        let mm = fecha_i.getUTCMonth() + 1;
        mm = mm.toString();
        let dd = fecha_i.getUTCDate();
        dd = dd.toString();
        publications[i]['fecha_i'] = dd+'/'+mm+'/'+yy;
        publications[i]['index']=((publications.length-parseInt(i)).toString()).padStart(3,0);
        if(publications[i].approved){
            publications[i]['approved']='Si';
        }else{
            publications[i]['approved']="No";
        };
        if(publications[i].check){
            publications[i]['check']='Si';
        }else{
            publications[i]['check']="No";
        };
    };

    res.render('publications/myPublications',{publications,Docente:true})
};

publicationsCtrl.deleteMyPublication = async (req,res) => {
    let {path,createdAt} = await Publication.findById(req.params.id)
    console.log("createdAt: ",createdAt)
    /*
    fs.unlink(path, async (err) =>{
        if (err) {
            console.error(err);
        } else {
            await Publication.findByIdAndDelete(req.params.id)
            res.redirect('/publications/myPublications')
        }
    });
    */
}

//Funcionario

publicationsCtrl.renderAudit = async (req, res) => {
    let publications = await Publication.find({reviewed:false}).lean();
    for (let i in publications) {
        let id = publications[i].id_Docente;
        if(id){
            let {name, lastname, sec_lastname} = await User.findById(id).lean();
            publications[i]['docente']=name+' '+' '+lastname+' '+sec_lastname;
        }
        let fecha_i = new Date(publications[i].datePublication);
        let yy = fecha_i.getFullYear();
        yy = yy.toString();
        let mm = fecha_i.getUTCMonth()+ 1;
        mm = (mm.toString()).padStart(2,0);
        let dd = fecha_i.getUTCDate();
        dd = (dd.toString()).padStart(2,0);
        publications[i]['fecha_i'] = dd+'/'+mm+'/'+yy;
        publications[i]['index']=parseInt(i)+1;
    };

    res.render('publications/audit',{publications,Funcionario:true})
};

publicationsCtrl.renderReviewed = async (req, res) => {
    let publications = await Publication.find({reviewed:true}).lean();
    for (let i in publications) {
        let id = publications[i].id_Docente;
        if(id){
            let {name, lastname, sec_lastname} = await User.findById(id).lean();
            publications[i]['docente']=name+' '+' '+lastname+' '+sec_lastname;
        }
        let fecha_i = new Date(publications[i].datePublication);
        let yy = fecha_i.getFullYear();
        yy = yy.toString();
        let mm = fecha_i.getUTCMonth() + 1;
        mm = mm.toString();
        let dd = fecha_i.getUTCDate();
        dd = dd.toString();
        publications[i]['fecha_i'] = dd+'/'+mm+'/'+yy;
        publications[i]['index']=parseInt(i)+1;
    };

    res.render('publications/reviewed',{publications,Funcionario:true})
};

publicationsCtrl.renderSearchPublication = async (req, res) => {
    let Admin =  Funcionario = null;
    let {role} = req.user;
    switch (role) {
        case 'Admin':
            Admin = true;
            break;
        case 'Funcionario':
            Funcionario = true;
            break;
    };
    let publications = await Publication.find({reviewed:true}).lean();
    for (let i in publications) {
        let id = publications[i].id_Docente;
        if(id){
            let {name, lastname, sec_lastname} = await User.findById(id).lean();
            publications[i]['docente']=name+' '+' '+lastname+' '+sec_lastname;
        }
        let fecha_i = new Date(publications[i].date);
        let yy = fecha_i.getFullYear();
        yy = yy.toString();
        let mm = fecha_i.getUTCMonth() + 1;
        mm = mm.toString();
        let dd = fecha_i.getUTCDate();
        dd = dd.toString();
        publications[i]['fecha_i'] = dd+'/'+mm+'/'+yy;
        publications[i]['index']=parseInt(i)+1;
    };

    res.render('publications/reviewed',{publications,Funcionario,Admin})
};

function caracterToView(data){
    switch (data) {
        case '1':
            return 'Científico';
            break;
        case '2':
            return 'Técnico';
            break;
        case '3':
            return 'Humanístico';
            break;
        case '4':
            return 'Artístico';
            break;
        case '5':
            return 'Pedagógico';
            break;
    }
}

publicationsCtrl.renderRequest = async (req, res) => {
    let {id} = req.params
    let {id_Docente,name,datePublication,description,clase,subclase,caracter,createdAt} = await Publication.findById(id).lean()
    fechaSolicitud = moment(createdAt).utc().format('DD/MM/YYYY');
    fechaPublicacion = moment(datePublication).utc().format('DD/MM/YYYY');
    let docente = await User.findById(id_Docente).lean();
    res.render('publications/request',{
        docente,fechaSolicitud,fechaPublicacion,name,description,clase,subclase,caracter,
        doc:true,
    })
}

publicationsCtrl.dowloadFile = async (req, res) => {
    let id = req.params.id;
    let {filename,originalname} = await Publication.findById(id).lean();
    res.download(path.join(__dirname , '../public/img/uploads/'+filename),originalname)
}

module.exports = publicationsCtrl;