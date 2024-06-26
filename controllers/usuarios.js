const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    try {
        const [ usuarios, total ] = await Promise.all([
            Usuario
                .find({}, 'nombre email role google img')
                .skip( desde )
                .limit( 5 ),
            Usuario
                .countDocuments()
        ]);

        res.status(200).json({
            ok:true,
            usuarios,
            total
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado revise logs'
        })
    }

};

const crearUsuario = async (req, res = response) => {

    const { email, password, nombre } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado.'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña en un hash de una sola vía
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario con contraseña encriptada
        await usuario.save();

        // Generar el JWT y servirlo en la response
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        })
    };

};

const actualizarUsuario = async (req, res = response) => {
    

    const uid = req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById(uid);

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // Actualizaciones
        const { password, google, email, role, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        if ( !usuarioDB.google ) {
            campos.email = email;
        } else if ( usuarioDB.email !== email ){
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de google no pueden cambiar su correo'
            });
        }

        // TODO validar token y comprobar si es el usuario correcto
        campos.role = role

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch ( error ) {
        console.log( error )
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
};

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById(uid);
        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario para esa id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });
    } catch ( error ) {
        console.log( error )
        res.status(400).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }
};


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
}