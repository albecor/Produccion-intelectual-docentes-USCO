const reportsCtrl = {};

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

reportsCtrl.renderGenerarInforme = (req,res) =>{
    res.render('publications/generarInforme', {Funcionario:true})
}

reportsCtrl.searchDocentes = async (req,res) =>{
    let {value} = req.query;
    let docentes = await User.find({role:'Docente'}).lean()
    if(value && value != 'todos'){
        docentes = await User.find({role:'Docente',facultad:value}).lean()
    }
    res.send({docentes})
}

reportsCtrl.searchDocenteCC = async (req,res)=>{
    let {cc} = req.query;
    let docente = await User.findOne({identification:cc,role:'Docente'}).lean()
    res.send({docente})
}

reportsCtrl.GenerarInforme = async (req,res) =>{
    let {switch_1, switch_2, switch_3} = req.body;
    switch_1 = switchToBoolean(switch_1)
    switch_2 = switchToBoolean(switch_2)
    switch_3 = switchToBoolean(switch_3)
    let publications = [];
    let data = {}
    if(switch_1){
        let {estado_1, estado_2, estado_3, estado_4, estado_5, estado_6, modalidad} = req.body
            Object.assign(data,{
            $or:[
                {estado:estado_1},
                {estado:estado_2},
                {estado:estado_3},
                {estado:estado_4},
                {estado:estado_5},
                {estado:estado_6}
            ]
        })
        if(modalidad != 'todas'){
            Object.assign(data,{modalidad})
        }
    }
    if(switch_2){
        let {yyyy, trimestre, startDate1, endDate1, startDate2, endDate2} = req.body;
        if(yyyy && !trimestre){
            let inicio = new Date(yyyy+'-01-01T00:00:00.000Z')
            let fin = new Date(yyyy+'-12-31T23:59:59.999Z')
            Object.assign(data,{fecha_solicitud: { $lte: fin, $gte: inicio }})
        }else if(yyyy && trimestre){
            let inicio;
            let fin;
            switch (trimestre) {
                case '1':
                    inicio = new Date(yyyy+'-01-01T00:00:00.000Z')
                    fin = new Date(yyyy+'-03-31T23:59:59.999Z')
                    break;
                case '2':
                    inicio = new Date(yyyy+'-04-01T00:00:00.000Z')
                    fin = new Date(yyyy+'-06-30T23:59:59.999Z')
                    break;
                case '3':
                    inicio = new Date(yyyy+'-07-01T00:00:00.000Z')
                    fin = new Date(yyyy+'-09-30T23:59:59.999Z')
                    break;
                case '4':
                    inicio = new Date(yyyy+'-10-01T00:00:00.000Z')
                    fin = new Date(yyyy+'-12-31T23:59:59.999Z')
                    break;
            }
            Object.assign(data,{fecha_solicitud: { $lte: fin, $gte: inicio }})
        }else if(startDate1 && endDate1){
            startDate1 = new Date(startDate1)
            endDate1 = new Date(endDate1)
            endDate1.setDate(endDate1.getDate()+1);
            endDate1.setHours(18, 59, 59, 999)
            Object.assign(data,{fecha_publicacion: { $lte: endDate1, $gte: startDate1 }})
        }else if(startDate2 && endDate2){
            startDate2 = new Date(startDate2)
            endDate2 = new Date(endDate2)
            endDate2.setDate(endDate2.getDate()+1);
            endDate2.setHours(18, 59, 59, 999)
            Object.assign(data,{fecha_solicitud: { $lte: endDate2, $gte: startDate2 }})
        }
    }
    if(switch_3){
        let{facultad,programa,docente} = req.body;
        if(docente != 'todos'){
            Object.assign(data,{docente})
        }else if(programa != 'todos'){
            Object.assign(data,{programa})
        }else if(facultad != 'todos'){
            Object.assign(data,{facultad})
        }
    }
    console.log(data)
    publications = await Publication.find(data)
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
        for(let i in publications){
            obj = publications[i]
            index = parseInt(i)+1;
            row = parseInt(i)+2;
            rownombre = worksheet1.getRow(row);
            let vigencia = parseInt(moment(obj.fecha_solicitud).utc().format('YYYY'));
            docente = await User.findById(obj.id_Docente).lean()
            let issn = await ISSN.findOne({ vigencia,$or: [ { issn_impreso: obj.issn }, { issn_electronico: obj.issn }, {issn_L:obj.issn} ] }).lean()
            let autores = await Autor.find({id_publication:obj._id}).lean()
            rownombre.getCell(1).value = index;
            rownombre.getCell(2).value = moment(obj.fecha_solicitud).utc().format('DD/MM/YYYY');
            rownombre.getCell(3).value = vigencia;
            rownombre.getCell(4).value = docente.facultad;
            rownombre.getCell(5).value = docente.programa;
            rownombre.getCell(6).value = docente.identification;
            rownombre.getCell(8).value = docente.name + ' ' + docente.lastname;
            rownombre.getCell(9).value = obj.modalidad;
            rownombre.getCell(10).value = obj.name;
            rownombre.getCell(12).value = obj.nombre_revista;
            rownombre.getCell(13).value = obj.editorial;
            rownombre.getCell(14).value = moment(obj.fecha_publicacion).utc().format('DD/MM/YYYY');
            rownombre.getCell(15).value = obj.ISSN;
            rownombre.getCell(16).value = autores.length+1
            let autores_print = '';
            autores.map((x,i) =>{
                i = parseInt(i)
                if(i >0)autores_print += ';'
                autores_print += x.nombre
            })
            rownombre.getCell(17).value = autores_print;
            let categoria;
            if(obj.categoria != 'A1'&& obj.categoria != 'A2' && obj.categoria!= 'B' && obj.categoria != 'C'){
                categoria= 'N/A'
            }else{
                categoria= obj.categoria;
            }
            rownombre.getCell(18).value = categoria;
        }
        await workbookw.xlsx.writeFile(fileWB2)
        
        
    })
    .then(()=>{
        const fs = require("fs");
        fs.readFile(fileWB2, (error, data) => {
        if(error) {
            throw error;
        }
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Informe_Producción_Académica_USCO.xlsx');
        res.send(data);
        })
    })
}

function switchToBoolean(swtch){
    if(swtch == '1'){
        return true
    }else{
        return false
    }
}

module.exports = reportsCtrl;