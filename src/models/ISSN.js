const {Schema, model} = require('mongoose');

const ISSN = Schema({

    titulo: {
        type: String,
        required: true
    },
    //Tipo de ISSN
    issn_impreso:{
        type: String
    },
    issn_electronico:{
        type: String
    },
    issn_L:{
        type: String
    },

    institucion_editora:{
        type: String,
        required: true
    },
    categoria:{
        type:String,
        required: true
    },

    vigencia:{
        type: Number,
        required: true
    }
},{
    timestamps: true
});


module.exports = model('issn', ISSN, 'issn');