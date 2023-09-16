
const { response } = require('express');
const Cita = require('../models/cita');

const crearCita = async (req, res = response) => {
    try {
        const { fecha, horaInicial, horaFinal, odontologo } = req.body;

        // Verificar si ya existen citas en la misma fecha y colisionan con las horas
        const citasExistente = await Cita.find({
            odontologo,
            fecha,
            $or: [
                {
                    horaInicial: { $lte: horaInicial },
                    horaFinal: { $gt: horaInicial },
                },
                {
                    horaInicial: { $lt: horaFinal },
                    horaFinal: { $gte: horaFinal },
                },
                {
                    horaInicial: { $gte: horaInicial },
                    horaFinal: { $lte: horaFinal },
                },
            ],
        });

        if (citasExistente.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe una cita en este horario',
            });
        }

        const cita = new Cita(req.body);
        await cita.save();

        res.json({
            ok: true,
            cita,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
}

const eliminarCita = async(req, res = response) => {
    try {
        const { id } = req.params;

        const cita = await Cita.findByIdAndDelete( id );

        res.json({
            ok: true, 
            cita
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Hable con el administrador'
        });
    }
}

const getCitasPorFecha = async(req, res = response) => {
    try {
        const { key, odontologo } = req.params;

        const cita = await Cita.find({
            "$and": [
                { fecha: key },
                { odontologo },
            ]
        }).sort({ horaInicial: 1 });
        
        if ( !cita ) {
            return res.status(400).json({
                ok: false,
                message: []
            });
        }
        
        res.json({
            ok: true,
            cita
        });
       
   } catch (error) {
       console.log(error);
       res.status(500).json({
           ok: false,
           msg: 'Hable con el administrador'
       });
   }
}

const getCitasCantidad = async (req, res = response) => {
    try {
        const { key, odontologo } = req.params;
        const citas = await Cita.find();
        if (!citas) {
            return res.status(400).json({
                ok: false,
                msg: []
            });
        }
        
        const citasPorFechaYOdontologo = {};

        citas.forEach(cita => {
            const { fecha, odontologo } = cita;
            if (!citasPorFechaYOdontologo[fecha]) {
                citasPorFechaYOdontologo[fecha] = {};
            }
            if (!citasPorFechaYOdontologo[fecha][odontologo]) {
                citasPorFechaYOdontologo[fecha][odontologo] = 0;
            }
            citasPorFechaYOdontologo[fecha][odontologo]++;
        });

        const result = [];

        for (const fecha in citasPorFechaYOdontologo) {
            for (const odontologo in citasPorFechaYOdontologo[fecha]) {
                result.push({
                    fecha,
                    cantidad: citasPorFechaYOdontologo[fecha][odontologo],
                    odontologo,
                });
            }
        }

        let filteredResult = result;
        if (odontologo) {
            filteredResult = result.filter(item => item.odontologo === odontologo);
        }

        res.json({
            ok: true,
            result: filteredResult
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const findCita = async (req, res = response) => {
    const { key } = req.params;
    const regex = new RegExp(key, 'i');

    try {
        const cita = await Cita.find({
            "$or": [
                { paciente: regex},
            ]
        });

        if (!cita) {
            return res.status(400).json({
                ok: false,
                msg: []
            });
        }

        res.json({
            ok: true,
            cita
        });    

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
}

const actualizarCita = async (req, res = response) => {
    const { id } = req.params;

    try {
        const cita = await Cita.findByIdAndUpdate(id, req.body, { new: true });

        if (!cita) {
            return res.status(404).json({
                ok: false,
                message: 'Cita no existe'
            });
        }


        res.json({
            ok: true,
            cita
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
    crearCita,
    eliminarCita,
    getCitasPorFecha,
    getCitasCantidad,
    findCita,
    actualizarCita
}