const {Schema, model} = require('mongoose');

const PublicationSchema = Schema({

    id_Docente: Schema.Types.ObjectId,

    approved: {
        type: Boolean,
        default: false,
    },

    check: {
        type: Boolean,
        default: false,
    },

    name: {type: String},

    datePublication: {type: Date},

    description: {type: String},
    
    URL: {type: String},

    clase:{type: String},

    subclase:{type: String},

    caracter:{type: String},

    filename: {type: String},

    path: {type: String},

    originalname: {type: String},

    mimetype: {type: String},

    size: {type: Number},

////////////////////////////////////////////
},{
    timestamps: true
});


module.exports = model('publication', PublicationSchema, 'publications');