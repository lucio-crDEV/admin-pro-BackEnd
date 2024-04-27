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


// Arreglo para cambiaar _id por uid en el response de getUsuarios, y quitando password de cualquier objeto de respuesta, se declara pero no se retorna para extraerlo
UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id
    return object
});

module.exports = model( 'Usuario', UsuarioSchema );