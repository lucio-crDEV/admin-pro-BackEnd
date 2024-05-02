const { response } = require('express');

const Medico = require('../models/medico');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');


const getTodo = async (req, res= response )=>{
    const busqueda = req.params.busqueda;

    const regex = new RegExp(busqueda, 'i');

    try {
        const [ usuarios, hospitales, medicos ] = await Promise.all([
            Usuario.find({ nombre: regex }),
            Hospital.find({ nombre: regex }),
            Medico.find({ nombre: regex })
        ]);

        res.status(200).json({
            ok: true,
            usuarios,
            medicos,
            hospitales
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'Búsqueda fallida contacte al admin.'
        });
    }
};


const getDocumentosColeccion = async (req, res= response )=>{
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    try {
        
        switch ( tabla ) {
            case 'usuarios':
                data = await Usuario.find({ nombre: regex })
                break;
            case 'hospitales':
                data = await Hospital.find({ nombre: regex })
                                     .populate('usuario', 'nombre img')
                break;
            case 'medicos':
                data = await Medico.find({ nombre: regex })
                                   .populate('usuario', 'nombre img')
                                   .populate('hospital', 'nombre img')
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
                });
        };
    
        res.status(200).json({
            ok: true,
            resultado: data
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error contacte al administrador'
        });
    }
};


module.exports = {
    getTodo,
    getDocumentosColeccion
};