const { response } = require('express');
const Hospital = require('../models/hospital');


const getHospitales = async ( req, res = response ) => {

    try {
        const hospitales = await Hospital.find()
                                         .populate('usuario', 'nombre img');

        res.json({
            ok: true,
            hospitales
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'No se pudo obtener la petición'
        });
    }
};

const crearHospital = async ( req, res = response ) => {
    
    const uid = req.uid
    const hospital = new Hospital( {
        usuario: uid,
        ...req.body
    });

    try {
        
        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    };
};

const actualizarHospital = async ( req, res = response )=> {

    // id hospital
    const id = req.params.id;
    
    // id usuario
    const uid = req.uid;

    try {

        const hospital = await Hospital.findById( id );
        
        if( !hospital ){
            return res.status(400).json({
                ok: false,
                msg: 'Hospital no encontrado por Id'
            });
        };

        // Actualizar
        const cambiosHospital = { 
            ...req.body,
            usuario: uid
         };

        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true } );

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

const borrarHospital = async ( req, res = response )=>{

    const id = req.params.id;

    try {
        
        const hospital = await Hospital.findById( id );

        if( !hospital ){
            return res.status(400).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            })
        };

        await Hospital.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin, no se borro hospital'
        });
    };
};


module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
};