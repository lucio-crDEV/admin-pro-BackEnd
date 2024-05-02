const path = require('path');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const { actualizarImagen } = require("../helpers/actualizar-imagen");


const fileUpload = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    // Validar tipo
    const tiposValidos = ['hospitales','medicos','usuarios'];
    if ( ! tiposValidos.includes( tipo ) ){
        return res.status(400).json({
            ok: false,
            msg: 'La url no especifíca medicos, usuarios u hospitales (path inválido)'
        });
    };

    // validar que exista archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    };

    // Procesar imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];

    // Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif']
    if ( !extensionesValidas.includes( extensionArchivo ) ){
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión de archivo permitida'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;


    // Path para imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    try {
        // Use the mv() method to place the file somewhere on your server
        file.mv( path, (err) => {
        if (err){
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg :'Error al mover la imagen'
            });
        };

        // Actualizar base de datos
        actualizarImagen( tipo, id, nombreArchivo );

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
            })
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado hable con el admin'
        });
    };

};


const retornarImagen = ( req, res = response )=>{
    
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );

    // Imagen por defecto
    if ( fs.existsSync( pathImg ) ){
        res.sendFile( pathImg );
    } else{
        const pathImg = path.join(__dirname, `../uploads/sinimagen.jpg`);
        res.sendFile( pathImg );
    }

}

module.exports = {
    fileUpload,
    retornarImagen
};