const { response } = require('express');
const bcrypt =  require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => { 

    const { email, password } = req.body; // extraer propiedades de req.body

    try {
        const existeEmail = await Usuario.findOne({ email }); // si existe email en la bd
        if( existeEmail ) 
            return res.status(400).json({
                ok: false,
                message: 'El correo ya existe'
            });

        const usuario = new Usuario( req.body );

        // encyptar password
        const salt = bcrypt.genSaltSync(); 
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }    
}

const login = async (req, res= response) => {

    const { email, password, rol } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email, rol  });

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Credenciales inválidas'
            });
        }

        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({ 
                ok: false,
                message: 'Contraseña inválido'
            });
        }

        // renovar jwt
        const token = await generarJWT( usuarioDB.id );

        res.json({ 
            ok: true,   
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Hable con el administrador'
        });
    }
}

const renewToken = async ( req, res = response ) => {

    const uid = req.uid;
    const token = await generarJWT( uid );
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        usuario,
        token
    });
}

const getUsuarios = async ( req, res = response ) => {

    try {
         // const desde = Number( req.query.desde ) || 0;

        const usuarios = await Usuario.find({
            rol: 'Odontologo'
        });
        // .skip(desde)
        // .limit(20);

        if (!usuarios) {
            return res.status(400).json({
                ok: false,
                message: []
            });
        }

        res.json({
            ok: true,
            usuarios
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Hable con el administrador'
        });
    }
}

const eliminarUsuario = async ( req, res = response ) => {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndDelete( id );

    res.json({
        ok: true,
        usuario
    });


}

module.exports = {
    crearUsuario,
    login,
    renewToken,
    getUsuarios,
    eliminarUsuario
}