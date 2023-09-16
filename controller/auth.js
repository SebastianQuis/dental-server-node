const { response } = require('express');
const bcrypt =  require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => { 

    const { email, dni, password } = req.body; // extraer propiedades de req.body

    try {
        const existeEmail = await Usuario.findOne({ email }); // si existe email en la bd
        if( existeEmail ) 
            return res.status(400).json({
                ok: false,
                message: 'El correo ya existe'
            });

        const existeDNI = await Usuario.findOne({ dni });
        if (existeDNI) {
            return res.status(400).json({
                ok: false,
                message: 'El DNI ya está registrado'
            });
        }

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
            rol: 'Odontologo',
            disponible: true,
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

const updateUsuario = async (req, res = response) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, { new: true });

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no existe'
            });
        }

        // paciente.edad = hallarEdad(paciente.nacimiento);

        res.json({
            ok: true,
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
}

module.exports = {
    crearUsuario,
    login,
    renewToken,
    getUsuarios,
    eliminarUsuario,
    updateUsuario
}