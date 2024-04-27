const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: "USER_ROLE"
    },
    google: {
        type: Boolean,
        default: false
    },
})


/* 
    Arreglo para cambiaar _id por uid en el objeto response,
    se declaran parametros pero no se retornan para eliminarlos o manipularlo a gusto
*/
UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id
    return object
});

module.exports = model( 'Usuario', UsuarioSchema );