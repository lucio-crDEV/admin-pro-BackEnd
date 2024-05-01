/*
    Medicos
    ruta '/api/medicos'
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
} = require('../controllers/medicos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',
    [
        // validarJWT,
        // validarCampos
    ],
     getMedicos);

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre del médico es requerido').not().notEmpty(),
        check('hospital', 'El hospital ID debe ser valido').isMongoId(),
        validarCampos
    ],
    crearMedico
);

router.put('/:id',
    [

    ],
    actualizarMedico
);
router.delete('/:id',
    [

    ]
    , borrarMedico
);


module.exports = router;