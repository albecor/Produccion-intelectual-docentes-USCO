const publicationsCtrl = {};

const Publication = require('../models/publications')
const User = require('../models/User')
const Autor = require('../models/autor')
const ISSN = require('../models/ISSN')
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');
const fs = require('fs');
const moment = require('moment');
var {Types} = require('mongoose');
const { query } = require('express');
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

publicationsCtrl.sizeVerification = async (req,res) => {
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

publicationsCtrl.AddPublication = async (req, res) => {
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
    let estado =  'Pendiente por revisión';
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
    let publications = await Publication.find({estado:'Pendiente por revisión'}).lean().sort({createdAt:1});
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

publicationsCtrl.renderAuditFnId = async (req, res) => {
    let {id} = req.params;
    let articulo = false, videos = false, libro = false, premio = false, PTec = false, obra = false, ponencia = false, capitulo = false;
    let publication = await Publication.findById(id).lean()
    switch (publication.modalidad) {
        case 'Artículo de Revista':
            articulo = true;
            break;
        case 'Producción de vídeos, cinematográficas o fonográficas':
            videos = true;
            break;
        case 'Libro':
            libro = true;
            break;
        case 'Premio':
            premio = true
            break;
        case 'Producción técnica':
            PTec = true;
            break;
        case 'Obras artísticas':
            obra = true;
            break;
        case 'Ponencia':
            ponencia = true;
            break;
        case 'Capítulo de Libro':
            capitulo = true;
            break;
    }
    publication['createdAt'] = moment(publication.createdAt).utc().format('DD/MM/YYYY');
    publication['fecha_publicacion'] = moment(publication.fecha_publicacion).utc().format('DD/MM/YYYY');
    publication['fecha_recepcion_revista'] = moment(publication.fecha_recepcion_revista).utc().format('DD/MM/YYYY');
    let docente = await User.findById(publication.id_Docente).lean()
    let autores = await Autor.find({id_publication:id}).lean()
    res.render('publications/FnOne',{
        publication,docente,autores,Funcionario:true,
        articulo, videos, libro, premio, PTec, obra, ponencia, capitulo
    })
};

publicationsCtrl.renderAuditCAP = async (req, res) => {
    let publications = await Publication.find({estado:'Revisado'}).lean()
    for (let i in publications) {
        let id = publications[i].id_Docente;
        if(id){
            let {name, lastname, sec_lastname} = await User.findById(id).lean();
            publications[i]['docente']=name+' '+' '+lastname+' '+sec_lastname;
        }
        publications[i]['fecha_i'] = moment(publications[i].fechaPublicacion).utc().format('DD/MM/YYYY');
        publications[i]['index']=parseInt(i)+1;
    };
    res.render('publications/AuditCAP',{publications, Funcionario:true})
};

publicationsCtrl.renderAuditCAPId = async (req, res) => {
    let {id} = req.params;
    let publication = await Publication.findById(id).lean()
    publication['createdAt'] = moment(publication.createdAt).utc().format('DD/MM/YYYY');
    publication['fecha_publicacion'] = moment(publication.fecha_publicacion).utc().format('DD/MM/YYYY');
    publication['fecha_recepcion_revista'] = moment(publication.fecha_recepcion_revista).utc().format('DD/MM/YYYY');
    let docente = await User.findById(publication.id_Docente).lean()
    let autores = await Autor.find({id_publication:id}).lean()
    res.render('publications/CAPone',{
        publication,docente,autores,Funcionario:true
    })
};

publicationsCtrl.revisionCAP = async (req, res) => {
    let {id,aceptado,tipo_puntaje,puntaje,conceptoCAP} = req.body;
    if(aceptado=='true'){
        if(tipo_puntaje == '1'){
            tipo_puntaje = true
        }else{
            tipo_puntaje = false
        }
        await Publication.findByIdAndUpdate(id,{estado:'Aprobado',conceptoCAP,tipo_puntaje,puntaje})
        res.redirect('/publications/reviewed/cap')
    }else{
        await Publication.findByIdAndUpdate(id,{estado:'No aprobado por CAP', conceptoCAP})
        res.redirect('/publications/rechazadas')
    }
}

publicationsCtrl.renderReviewedCAP = async (req, res) => {
    let publications = await Publication.find({estado:'Aprobado'}).lean();
    for (let i in publications) {
        let id = publications[i].id_Docente;
        if(id){
            let {name, lastname, sec_lastname} = await User.findById(id).lean();
            publications[i]['docente']=name+' '+' '+lastname+' '+sec_lastname;
        }
        publications[i]['fecha_i'] = moment(publications[i].fechaPublicacion).utc().format('DD/MM/YYYY');
        publications[i]['index']=parseInt(i)+1;
    };

    res.render('publications/reviewedCAP',{publications,Funcionario:true})
};

publicationsCtrl.renderReviewed = async (req, res) => {
    let publications = await Publication.find({estado:'Revisado'}).lean();
    for (let i in publications) {
        let id = publications[i].id_Docente;
        if(id){
            let {name, lastname, sec_lastname} = await User.findById(id).lean();
            publications[i]['docente']=name+' '+' '+lastname+' '+sec_lastname;
        }
        publications[i]['fecha_i'] = moment(publications[i].fechaPublicacion).utc().format('DD/MM/YYYY');
        publications[i]['index']=parseInt(i)+1;
    };

    res.render('publications/reviewed',{publications,Funcionario:true})
};

publicationsCtrl.renderSearchPublication = async (req, res) => {
    res.render('publications/searchPublications',{Funcionario})
};

publicationsCtrl.SearchPublication = async (req, res) => {
    let {estado_1,estado_2, estado_3, estado_4, estado_5, startDate,endDate} = req.body;
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    endDate.setDate(endDate.getDate()+1);
    endDate.setHours(18, 59, 59, 999)
    if(!estado_1)estado_1 = '';
    if(!estado_2)estado_2 = '';
    if(!estado_3)estado_3 = '';
    if(!estado_4)estado_4 = '';
    if(!estado_5)estado_5 = '';
    let publications = await Publication.find({
        $or:[
            {estado:estado_1},
            {estado:estado_2},
            {estado:estado_3},
            {estado:estado_4},
            {estado:estado_5}
        ],
        "createdAt": { $gte: startDate, $lte: endDate }
    }).lean();
    res.send({publications})
}

publicationsCtrl.renderRequest = async (req, res) => {
    let {id} = req.params
    let publication = await Publication.findById(id).lean()
    let articulo = false, videos = false, libro = false, premio = false, PTec = false, obra = false, ponencia = false, capitulo = false;
    switch (publication.modalidad) {
        case 'Artículo de Revista':
            articulo = true;
            break;
        case 'Producción de vídeos, cinematográficas o fonográficas':
            videos = true;
            break;
        case 'Libro':
            libro = true;
            break;
        case 'Premio':
            premio = true
            break;
        case 'Producción técnica':
            PTec = true;
            break;
        case 'Obras artísticas':
            obra = true;
            break;
        case 'Ponencia':
            ponencia = true;
            break;
        case 'Capítulo de Libro':
            capitulo = true;
            break;
    }
    publication['createdAt'] = moment(publication.createdAt).utc().format('DD/MM/YYYY');
    publication['fecha_publicacion'] = moment(publication.fecha_publicacion).utc().format('DD/MM/YYYY');
    publication['fecha_recepcion_revista'] = moment(publication.fecha_recepcion_revista).utc().format('DD/MM/YYYY');
    let docente = await User.findById(publication.id_Docente).lean()
    let autores = await Autor.find({id_publication:id}).lean()
    res.render('publications/request',{
        docente,publication,
        articulo, videos, libro, premio, PTec, obra, ponencia, capitulo,
        doc:true,
    })
}

publicationsCtrl.dowloadFile = async (req, res) => {
    let {id} = req.params;
    let {filename,originalname} = await Publication.findById(id).lean();
    res.download(path.join(__dirname , '../public/uploads/'+filename),originalname)
}

publicationsCtrl.renderLoadISSN = async (req,res) => {
    res.render('publications/loadissn', {Admin:true})
}

publicationsCtrl.renderISSN = async (req,res) => {
    let issn = await ISSN.find().sort({vigencia:-1}).lean()
    res.render('publications/issn', {
        issn,Admin:true
    })
}

publicationsCtrl.loadISSN = async (req,res) => {
    const mongoose = require('mongoose');
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            filePath = path.join(__dirname , '../public/xlsx')
            cb(null, filePath)
        },
        filename: function (req, file, cb) {
            cb(null, 'issn.xlsx')
        }
    })
    
    let upload = multer({ storage }).single("file")
    upload(req, res, async (err) => {
        if(err){
            console.log(err)
        }else{
        let {vigencia} = req.body
        var XLSX = require('xlsx');
        const path = require('path');
        dirWB = path.dirname(__dirname)
        fileWB = path.join(dirWB + '/public/xlsx/issn.xlsx');
        var workbook = XLSX.readFile(fileWB);
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        let data = [];
        xlData.map(async(doc,i,a)=>{
            let lengthDOC = Object.keys(doc).length
            let issn_impreso = doc['ISSN IMPRESO']
            if(!issn_impreso)issn_impreso = '---'
            let issn_electronico = doc['ISSN ELECTRÓNICO']
            if(!issn_electronico)issn_electronico = '---'
            let issn_L = doc['ISSN L']
            if(!issn_L)issn_L = '---'
            let titulo = doc['TÍTULO']
            let institucion_editora = doc['INSTITUCIONES EDITORAS']
            if(!institucion_editora)institucion_editora = '---'
            let categoria = doc['CATEGORÍA']
            let issn = await ISSN.findOne({ vigencia, $or: [ { issn_impreso }, { issn_electronico }, {issn_L} ] }).lean()
            if(!issn){
                let newISSN = new ISSN({
                    titulo,
                    issn_impreso,
                    issn_electronico,
                    issn_L,
                    institucion_editora,
                    categoria,
                    vigencia
                })
                newISSN.save((err)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
        res.redirect('/view/issn');
        }
    });
}

publicationsCtrl.checkISSN = async (req, res) => {
    let {id} = req.query;
    let {ISSN:query,fecha_publicacion} = await Publication.findById(id).lean()
    let vigencia = moment(fecha_publicacion).year()
    let issn = await ISSN.findOne({ vigencia,$or: [ { issn_impreso: query }, { issn_electronico: query }, {issn_L:query} ] }).lean()
    let validation = true;
    if(!issn)validation = false;
    res.send({validation})
}

publicationsCtrl.primeraRevision = async (req, res) =>{
    let{observacion, accept, id_publication} = req.body;
    if(accept == 'true'){
        await Publication.findByIdAndUpdate(id_publication,{estado:'Revisado',observacion})
        res.redirect('/publications/reviewed/fn')
    }else{
        await Publication.findByIdAndUpdate(id_publication,{estado:'Rechazado',observacion})
        res.redirect('/publications/rechazadas')
    }
}

publicationsCtrl.renderRechazadas = async (req, res) => {
    let publications = await Publication.find({$or: [{estado:'Rechazado'}, {estado:'No aprobado por CAP'}]}).lean().sort({createdAt:1});
    for (let i in publications) {
        let id = publications[i].id_Docente;
        if(id){
            let {name, lastname, sec_lastname, facultad, programa} = await User.findById(id).lean();
            publications[i]['docente']=name+' '+' '+lastname+' '+sec_lastname;
            publications[i]['facultad']=facultad;
            publications[i]['programa']=programa;
        }
        publications[i]['fecha_publicacion'] = moment(publications[i].fecha_publicacion).utc().format('DD/MM/YYYY');
        publications[i]['index']=parseInt(i)+1;
    };

    res.render('publications/rechazadas',{publications,Funcionario:true})
};

publicationsCtrl.renderGenerarInforme = (req,res) =>{
    res.render('publications/generarInforme', {Funcionario:true})
}

publicationsCtrl.searchDocentes = async (req,res) =>{
    let {value} = req.query;
    let docentes = await User.find({role:'Docente'}).lean()
    if(value && value != 'todos'){
        docentes = await User.find({role:'Docente',facultad:value}).lean()
    }
    res.send({docentes})
}

publicationsCtrl.GenerarInforme = async (req,res) =>{
    let {switch_1, switch_2, switch_3} = req.body;
    switch_1 = switchToBoolean(switch_1)
    switch_2 = switchToBoolean(switch_2)
    switch_3 = switchToBoolean(switch_3)
    if(!switch_1&&!switch_2&&!switch_3){
        var XLSX = require('xlsx');
        var Excel = require('exceljs');
        const path = require('path');
        var workbook = XLSX.readFile('src/public/xlsx/informe.xlsx');
        var sheet_name_list = workbook.SheetNames;
        dirWB = path.dirname(__dirname)
        fileWB = path.join(dirWB + '/public/xlsx/informe.xlsx');
        fileWB2 = path.join(dirWB + '/public/xlsx/informe2.xlsx');
        var workbookw = new Excel.Workbook();
        await workbookw.xlsx.readFile(fileWB)
        .then(async function () {
            var worksheet1 = workbookw.getWorksheet(sheet_name_list[0]);


            await workbookw.xlsx.writeFile(fileWB2)
        })
        .then(()=>{
            const fs = require("fs");
            fs.readFile(fileWB2, (error, data) => {
            if(error) {
                throw error;
            }
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Informe.xlsx');
            res.send(data);
        })
        })
    }
}

function switchToBoolean(swtch){
    if(swtch == '1'){
        return true
    }else{
        return false
    }
}

module.exports = publicationsCtrl;