const {Schema, model} = require('mongoose');

const PublicationSchema = Schema({

    name: {
        type: String,
        required: true
    },

    modalidad: {
        type: String,
        required: true
    },

    categoria: {
        type: String
    },

    tipo: {
        type: String
    },

    nombre_revista:{
        type: String
    },

    tiempo_revista:{
        type: Number
    },

    fecha_recepcion_revista:{
        type: Date
    },

    fecha_publicacion: {
        type: Date
    },

    fecha_solicitud: {
        type: Date
    },

    ISXN:{              //ó ISBN
        type:String
    },

    recursos_U:{
        type:Boolean
    },

    nombre_proyecto_investigacion:{
        type: String
    },

    editorial:{
        type:String
    },

    URL: {
        type: String
    },

    cambio_categoria: {
        type: Boolean
    },

//Datos del Archivo
    
    filename: {type: String},

    path: {type: String},

    originalname: {type: String},

    mimetype: {type: String},

    size: {type: Number},


//Revisiones

    id_Docente: Schema.Types.ObjectId,

    estado: {
        type: String,
        enum: ['Pendiente por revisión','Revisado', 'Editar', 'Rechazado','No aprobado por CAP','Aprobado'],
        default: 'Pendiente por revisión',
    },

    observacion:{
        type: String
    },

    conceptoCAP:{
        type: String
    },

    tipo_puntaje:{
        type: Boolean   //true = Bonificación por productividad académica
                        //false = Reconocimiento de puntos salariales
    },

    puntaje: {
        type: Number
    }
////////////////////////////////////////////
},{
    timestamps: true
});


module.exports = model('publication', PublicationSchema);