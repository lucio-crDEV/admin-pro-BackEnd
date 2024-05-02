const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const googleVerify = require('../helpers/google-verify');

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

const googleSingIn = async ( req, res = response ) => { 

    try {    
        const { email, name, picture } = await googleVerify( req.body.token );
        
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if(!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar usuario
        await usuario.save()
        
        // Generar JWT
        const token = await generarJWT( usuario.id );


        res.json({
                   ok: true,
                   email, name, picture, token
       });
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'El token de Google no es correcto'
        })
    }
};


const renewToken = async ( req, res = response ) => {

    const uid = req.uid;

    // Generar JWT
    const token = await generarJWT( uid );


    res.json({
        ok: true,
        token
    })

};

module.exports = {
    loginUser,
    googleSingIn,
    renewToken
};