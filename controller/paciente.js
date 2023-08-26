const { response } = require('express');
const hallarEdad = require('../helpers/paciente');
const Paciente = require('../models/paciente');

const crearPaciente = async(req, res = response ) => {

    const { dni } = req.body;

    try {
        const existePaciente = await Paciente.findOne({ dni });
        
        if (existePaciente) 
            return res.status(400).json({
                ok: false,
                msg: 'El dni ya existe'
            });
        
        const paciente = new Paciente(req.body);
        paciente.edad = hallarEdad(paciente.nacimiento);
        
        await paciente.save();

        res.json({
            ok: true,
            paciente
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const getPacientes = async(req, res = response) => {

    try {
        // const desde = Number( req.query.desde ) || 0;

       const pacientes = await Paciente.find().sort('-activo');
       // .skip(desde)
       // .limit(20);

       if (!pacientes) {
           return res.status(400).json({
               ok: false,
               msg: []
           });
       }

       res.json({
           ok: true,
           pacientes
       });
       
   } catch (error) {
       console.log(error);
       res.status(500).json({
           ok: false,
           msg: 'Hable con el administrador'
       });
   }

}

const updatePaciente = async (req, res = response) => {
    const { id } = req.params;

    try {
        const paciente = await Paciente.findByIdAndUpdate(id, req.body, { new: true });

        if (!paciente) {
            return res.status(404).json({
                ok: false,
                message: 'Paciente no existe'
            });
        }

        paciente.edad = hallarEdad(paciente.nacimiento);
        

        res.json({
            ok: true,
            paciente
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
}

const findPaciente = async(req, res = response) => {

    const { key } = req.params;
    const regex = new RegExp(key, 'i');

    try {
        const pacientes = await Paciente.find({
            "$or": [
                { nombres: regex},
                { apellidos: regex},
            ]
        });
    
        if (!pacientes) {
            return res.status(400).json({
                ok: false,
                msg: []
            });
        }
    
        res.json({
            ok: true,
            pacientes
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
    crearPaciente,
    getPacientes,
    updatePaciente,
    findPaciente
}
