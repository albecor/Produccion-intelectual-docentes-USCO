const {Schema, model} = require('mongoose');

const ISBN = Schema({
    isbn:{type: String, required: true},
    titulo:{type: String, required: true},
    impreso:{type: Boolean},
    digital:{type: Boolean},
    procedencia:{type: String},
    editor:{type:String},
    yyyy_publicacion:{type:Number, required:true}
},{
    timestamps: true
});


module.exports = model('isbn', ISBN, 'isbn');