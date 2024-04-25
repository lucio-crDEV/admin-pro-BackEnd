const Usuario = require('../models/usuario');

const getUsuarios = async (req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google' );

    res.json({
        usuarios
    })

};

const crearUsuario = async (req, res) => {
    
    const { email, password, nombre } = req.body;
    
    // sin validacion se va a pulir más adelante

    const usuario = new Usuario( req.body );

    await usuario.save();


    res.json({
        ok: true,
        usuario
    })
};


module.exports = {
    getUsuarios,
    crearUsuario
}