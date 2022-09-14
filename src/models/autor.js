const {Schema, model} = require('mongoose');

const Autor = Schema({

    id_publication: Schema.Types.ObjectId,

    nombre: {
        type: String,
        required: true
    },

    id_type: {
        type: String,
        required: true
    },

    numero_id: {
        type: String
    }

},
{
    timestamps: true
});


module.exports = model('autor', Autor);