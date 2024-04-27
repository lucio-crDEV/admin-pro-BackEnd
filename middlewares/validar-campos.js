const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = ( req, res = response, next ) => {

    const errores = validationResult( req ); //retorna arreglo de errores generados en el req
    if ( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errores : errores.mapped() //destructurando errors[{}]
        });
    }
  
    next();
};


module.exports = {
    validarCampos
};