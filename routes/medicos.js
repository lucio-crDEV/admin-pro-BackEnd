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
    borrarMedico,
    getMedicoById
} = require('../controllers/medicos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getMedicos);

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre del médico es requerido').not().isEmpty(),
        check('hospital', 'El hospital ID debe ser valido').isMongoId(),
        validarCampos
    ],
    crearMedico
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('hospital', 'El hospital id debe ser válido').isMongoId(),
        validarCampos
    ],
    actualizarMedico
);
router.delete('/:id', validarJWT, borrarMedico );

router.get('/:id', validarJWT, getMedicoById );


module.exports = router;