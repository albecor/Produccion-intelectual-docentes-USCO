const publicationsCtrl = {};

const Publication = require('../models/publications')
const User = require('../models/User')
const Autor = require('../models/autor')
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');
const fs = require('fs');
const moment = require('moment');
var {Types} = require('mongoose');
let {ObjectId} = Types


publicationsCtrl.renderAddPublication = (req, res) => {
    let Docente = true;
    let modalidades = require('../public/json/modalidades.json');
    let json = [];
    modalidades.map((i)=>{
        add = i.name
        json.push(add)
    })
    res.render('publications/addPublication',{json,Docente})
};



publicationsCtrl.sizeVerification = async (req,res,next) => {
    const storage = multer.diskStorage({
        destination: (req,file, cb)=>{
            filePath = path.join(__dirname , '../public/uploads')
            cb(null,filePath)
        },
        filename: (req, file, cb, filename) => {
            cb(null, uuid() + path.extname(file.originalname));
        }
    })
    const uploadFile = multer({
        storage,
        //limits: {fileSize: 1000000 * 5}
    }).single('upFile');

    uploadFile(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.send(false)
        }else{
            return await res.send(req.file)
        }
    })
}

publicationsCtrl.AddPublication = async (req, res, next) => {
    let {
        name,
        datePublication,
        modalidad,
        categoria,
        tipo,
        nombre_revista,
        tiempo_revista,
        fecha_recepcion_revista,
        fecha_publicacion,
        ISSN,
        recursos_U,
        nombre_proyecto_investigacion,
        editorial,
        URL,
        cambio_categoria,
        filename,
        path,
        originalname,
        mimetype,
        size,
        numero_autores
    } = req.body;
    let id_Docente = req.user.id;
    var _id = ObjectId();
    let estado =  'Pendiente de Validación';
    const newPublication = new Publication({
        _id,
        id_Docente,
        name,
        datePublication,
        modalidad,
        categoria,
        tipo,
        nombre_revista,
        tiempo_revista,
        fecha_recepcion_revista,
        fecha_publicacion,
        ISSN,
        recursos_U,
        nombre_proyecto_investigacion,
        editorial,
        URL,
        cambio_categoria,
        filename,
        path,
        originalname,
        mimetype,
        size,
        estado
    });
    await newPublication.save();
    numero_autores = parseInt(numero_autores)
    if(numero_autores > 1){
        for (let i = 0; i < numero_autores-1; i++) {
            add = i + 2;
            nombre = req.body['autor_name_'+add]
            id_type = req.body['autor_id_type_'+add]
            numero_id = req.body['autor_id_'+add]
            let newAutor = new Autor({
                id_publication: _id,
                nombre,
                id_type,
                numero_id
            })
            await newAutor.save();
        }
    }
    res.send(true)
};

publicationsCtrl.renderMyPublications = async (req, res) => {
    let {id} = req.user;
    let publications = await Publication.find({id_Docente:id}).sort({createdAt:-1}).lean();
    for (let i in publications) {
        publications[i]['createdAt'] = moment(publications[i].createdAt).utc().format('DD/MM/YYYY');
        publications[i]['fecha_publicacion'] = moment(publications[i].fecha_publicacion).utc().format('DD/MM/YYYY');
        publications[i]['index']=((publications.length-parseInt(i)).toString()).padStart(3,0);
    };

    res.render('publications/myPublications',{publications,Docente:true})
};

publicationsCtrl.timeVerification = async (req,res) => {
    let {id} = req.query;
    let {createdAt} = await Publication.findById(id)
    let date = new Date()
    date = (date-createdAt)/60000
    let allow = true;
    if(date > 5  ){
        allow = false
    }
    res.send({allow})
}

publicationsCtrl.deleteMyPublication = async (req,res) => {
    let {path,createdAt} = await Publication.findById(req.params.id)
    let date = new Date()
    date = (date-createdAt)/60000
    if(date > 5 ){
        req.flash('error_msg', 'El tiempo límite para eliminar es de 5min, ese tiempo ya expiró');
        res.redirect('/publications/myPublications')
    }else{
        fs.unlink(path, async (err) =>{
            if (err) {
                console.error(err);
            } else {
                let autores = await Autor.find({id_publication:req.params.id})
                if(autores.length>0){
                    autores.map(async (aut)=>{
                        await Autor.findByIdAndDelete(aut._id)
                    })

                }
                await Publication.findByIdAndDelete(req.params.id)
                res.redirect('/publications/myPublications')
            }
        });
    }
}

//Funcionario

publicationsCtrl.renderAuditFn = async (req, res) => {
    let publications = await Publication.find({estado:'Pendiente de Validación'}).lean().sort({createdAt:1});
    for (let i in publications) {
        let id = publications[i].id_Docente;
        if(id){
            let {name, lastname, sec_lastname, facultad, programa} = await User.findById(id).lean();
            publications[i]['docente']=name+' '+' '+lastname+' '+sec_lastname;
            publications[i]['facultad']=facultad;
            publications[i]['programa']=programa;
        }
        publications[i]['createdAt'] = moment(publications[i].createdAt).utc().format('DD/MM/YYYY');
        publications[i]['index']=parseInt(i)+1;
    };

    res.render('publications/AuditFn',{publications,Funcionario:true})
};

publicationsCtrl.renderAuditCAP = async (req, res) => {
    

    res.render('publications/AuditCAP',{Funcionario:true})
};

publicationsCtrl.renderAuditFnId = async (req, res) => {
    let {id} = req.params;
    let publication = await Publication.findById(id).lean()
    publication['createdAt'] = moment(publication.createdAt).utc().format('DD/MM/YYYY');
    publication['fecha_publicacion'] = moment(publication.fecha_publicacion).utc().format('DD/MM/YYYY');
    let docente = await User.findById(publication.id_Docente).lean()
    let autores = await Autor.find({id_publication:id}).lean()
    console.log(docente)
    res.render('publications/FnOne',{publication,docente,autores,Funcionario:true})
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
    let {id} = req.params;
    let {filename,originalname} = await Publication.findById(id).lean();
    res.download(path.join(__dirname , '../public/uploads/'+filename),originalname)
}

module.exports = publicationsCtrl;