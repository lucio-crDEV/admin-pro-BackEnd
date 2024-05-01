const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const loginUser = async ( req, res = response ) => { 
    
    const { email, password } = await req.body;
    try {
        // Se puede agregar unos segundos de retraso para no dar pistas de que es lo que esta realmente inválido en el proceso de log
        
        // Verifica que exista user por email
        const usuarioDB = await Usuario.findOne({ email });
        
        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario y/o contraseña no válido'
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario y/o contraseña no válido'
            })
        }

        // Generar JWT
        const token = await generarJWT( usuarioDB.id );

        res.status(200).json({
            ok: true,
            token
        });
    } catch ( error ) {
        console.log( error )
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    };
}

module.exports = {
    loginUser
}