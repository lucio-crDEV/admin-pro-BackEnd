/* 
    Path: '/api/login'
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { loginUser, googleSingIn, renewToken } = require('../controllers/auth');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post( '/',
    [
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],
    loginUser
);


router.post( '/google',
    [
        check('token', 'El token de google es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    googleSingIn
);


router.get('/renew', 
    validarJWT, 
    renewToken
);


module.exports = router;