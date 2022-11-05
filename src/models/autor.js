const {Schema, model} = require('mongoose');

const Autor = Schema({

    id_publication: Schema.Types.ObjectId,

    nombre: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});


module.exports = model('autor', Autor);