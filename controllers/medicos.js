const { response } = require('express');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getMedicos = async (req, res = response) => {

    try {
        const medicos = await Medico.find()
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre img')

        res.status(200).json({
            ok: true,
            medicos
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador'
        })
    }
};

const getMedicoById = async (req, res = response) => {

    const id = req.params.id;

    try {
        const medico = await Medico.findById(id)
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre img')

        res.status(200).json({
            ok: true,
            medico
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador'
        })
    }
};

const crearMedico = async (req, res = response) => {

    // user id
    const uid = req.uid
   
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.status(200).json({
            ok: true,
            medico: medicoDB
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
};

const actualizarMedico = async (req, res = response) => {

    const hospitalId = req.body.hospital;
    const medicoId = req.params.id;
    const userId = req.uid;
    
    try {
        // consultas
        const hospital = await Hospital.findById( hospitalId );
        const medico = await Medico.findById( medicoId );

        // validación
        if( !hospital ){
            res.status(400).json({
                ok: false,
                msg: 'Hospital no encontrado por Id'
            });
        } else if ( !medico ){
            res.status(400).json({
                ok: false,
                msg: 'Médico no encontrado por Id'
            });
        };

        // Actualizar
        const cambiosMedico = {
            ...req.body,
            nombre: req.body.nombre,
            usuario: userId,
            hospital: hospitalId
        }
        
        const medicoActualizado = await Medico.findByIdAndUpdate( medicoId, cambiosMedico, { new: true } )
        
        res.status(200).json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al actulizar, contactar admin.'
        })
    }


};

const borrarMedico = async (req, res = response) => {

    const id = req.params.id;
    
    try {
        // consulta
        const medico = await Medico.findById( id );
        // validación
        if(!medico){
            return res.status(400).json({
                ok: false,
                msg: 'Médico no encontrado por id'
            });
        };
        
        // Delete
        await Medico.findByIdAndDelete( id );

        // Response
        res.status(200).json({
            ok: true,
            msg: 'Médico eliminado'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error hable con admin'
        });
    };
}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
};