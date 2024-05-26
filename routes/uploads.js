/*
    ruta: api/uploads
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validarJWT, validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');
const { fileUpload, retornarImagen } = require('../controllers/uploads');


const router = Router();

router.use( expressFileUpload() );

router.put('/:tipo/:id', 
    [
        validarJWT, 
        validarADMIN_ROLE_o_MismoUsuario
    ], 
    fileUpload)

router.get('/:tipo/:foto', retornarImagen)

module.exports = router;